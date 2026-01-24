import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";
import { isValidObjectId } from "mongoose";

const configs = {
  owner: {
    model: ownerModel,
    receiverModel: managerModel,
    receiverModelError: "مدیر یافت نشد",
  },
  manager: {
    model: managerModel,
    receiverModel: teacherModel,
    receiverModelError: "معلم یافت نشد",
  },
  teacher: {
    model: teacherModel,
    receiverModel: managerModel,
    receiverModelError: "مدیر یافت نشد",
  },
};

export default async function GetReceiver(req, res) {
  if (req.method != "GET") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const { id: receiverId } = req.query;

  try {
    await connectToDb();

    const auth = RBAC(req, res, ["owner", "teacher", "manager"], {
      status: false,
    });
    if (!auth) return;
    const { nationalCode, role } = auth;
    const sender = await configs[role].model.findOne({ nationalCode });
    if (!sender) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }

    if (receiverId == "owner") {
      const owner = await ownerModel.findOne({});
      return res.json({
        receiver: { firstName: "مدیر سیستم", _id: owner._id },
        success: true,
      });
    }
    if (receiverId == "manager" && role == "teacher") {
      const teacher = await teacherModel
        .findOne({ nationalCode })
        .populate("manager", "_id firstName lastName role");
      if (!teacher) {
        return res
          .status(403)
          .json({ error: "دسترسی غیر مجاز", success: false });
      }

      return res.json({
        receiver: {
          firstName: teacher?.manager?.firstName,
          _id: teacher?.manager?._id,
          lastName: teacher?.manager?.lastName,
        },
        success: true,
      });
    }
    if (!receiverId || !isValidObjectId(receiverId)) {
      return res
        .status(422)
        .json({ error: "اطلاعات مخاطب نامعتبر است", success: false });
    }

    const receiver = await configs[role].receiverModel.findById(receiverId);
    if (!receiver) {
      return res
        .status(404)
        .json({ error: configs[role].receiverModelError, success: false });
    }
    return res.json({
      receiver: {
        _id: receiver._id,
        firstName: receiver?.firstName,
        lastName: receiver?.lastName,
        role: receiver?.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}
