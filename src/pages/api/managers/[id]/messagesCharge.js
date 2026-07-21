import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";
import teacherAttendanceModel from "@/models/teacherAttendance";
import studentAttendanceModel from "@/models/studentAttendance";
import studentModel from "@/models/student";
import { isValidObjectId } from "mongoose";

export default async function MessagesCharge(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner"], {
    status: true,
    errorMessage: "مدیر یافت نشد",
  });

  if (!auth) return;
  const { nationalCode } = auth;

  const { id } = req.query;
  if (!id || !isValidObjectId(id)) {
    return res
      .status(422)
      .json({ error: "آیدی مدیر نامعتبر است", success: false });
  }
  const { count } = req.body;
  if (!count) {
    return res
      .status(422)
      .json({ error: "مقدار پیامک برای شارژ مشخص نشده است", success: false });
  }

  if (isNaN(Number(count))) {
    return res
      .status(422)
      .json({ error: "مقدار شارژ باید عدد باشد", success: false });
  }

  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    const manager = await managerModel.findOne({ _id: id });
    if (!manager) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }
    manager.messagesCharge = manager.messagesCharge + Number(count);
    await manager.save();
    return res.json({
      message: "شارژ پیامک با موفقیت انجام شد",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", success: false, dbError: error });
  }
}
