import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";
import { isValidObjectId } from "mongoose";

export default async function Notifications(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const ALLOWED_STATUS = ["error", "warning", "success", "info"];
  const { text, status, receiver } = req.body;
  if (!text?.trim() || !ALLOWED_STATUS.includes(status?.[0])) {
    return res
      .status(422)
      .json({ error: "متن یا وضعیت اعلان نامعتبر است", success: false });
  }

  if (!receiver || !Array.isArray(receiver)) {
    return res
      .status(422)
      .json({ error: "اطلاعات گیرنده ها نادرست است", success: false });
  }

  if (receiver.includes("all") && receiver.length > 1) {
    return res.status(422).json({
      error: "برای ارسال اعلان به همه کاربران ، فقط گزینه همه را انتخاب کنید",
      success: false,
    });
  }

  const isValidReceiverIds = receiver?.every((id) => isValidObjectId(id));

  if (receiver?.[0] != "all" && !isValidReceiverIds) {
    return res
      .status(422)
      .json({ error: "اطلاعات فرستنده نامعتبر است", success: false });
  }

  const auth = RBAC(req, res, ["owner"]);

  if (!auth) return;
  const { nationalCode } = auth;

  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }

    if (receiver?.[0] == "all") {
      await managerModel.updateMany(
        {},
        {
          $push: {
            notifications: {
              $each: [{ text, status: status?.[0] }],
              $slice: -50,
            },
          },
        },
      );
      await teacherModel.updateMany(
        {},
        {
          $push: {
            notifications: {
              $each: [{ text, status: status?.[0] }],
              $slice: -50,
            },
          },
        },
      );
      return res.json({
        message: "اعلانات با موفقیت ارسال شدند",
        success: true,
      });
    } else {
      const managerIds = receiver?.map((id) => String(id));
      const managers = await managerModel.countDocuments({
        _id: { $in: managerIds },
      });
      if (managers != receiver.length) {
        return res
          .status(422)
          .json({ error: "برخی از مدیران یافت نشدند", success: false });
      }
      await managerModel.updateMany(
        { _id: { $in: managerIds } },
        {
          $push: {
            notifications: {
              $each: [{ text, status: status?.[0] }],
              $slice: -50,
            },
          },
        },
      );
      return res
        .status(201)
        .json({ message: "اعلان با موفقیت ارسال شد", success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
