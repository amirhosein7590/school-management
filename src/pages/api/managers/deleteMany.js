import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";
import teacherModel from "@/models/teacher";
import studentModel from "@/models/student";
import teacherAttendanceModel from "@/models/teacherAttendance";
import studentAttendanceModel from "@/models/studentAttendance";

export default async function DeleteManyManagers(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner"], { status: false });
  if (!auth) return;

  const { nationalCode, role } = auth;
  const owner = await ownerModel.findOne({ nationalCode });
  if (!owner) {
    return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
  }

  if (!req.body || !req.body.ids) {
    return res
      .status(422)
      .json({ error: "آیدی مدیران الزامی است", success: false });
  }

  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res
      .status(422)
      .json({ error: "آیدی‌ها باید به صورت آرایه باشند", success: false });
  }

  if (ids.length === 0) {
    return res
      .status(422)
      .json({ error: "هیچ آیدی‌ای ارسال نشده است", success: false });
  }

  const isValidIds = ids.every((id) => isValidObjectId(id));
  if (!isValidIds) {
    return res
      .status(422)
      .json({ error: "یک یا چند آیدی معتبر نیست", success: false });
  }

  try {
    await connectToDb();

    const existingManagers = await managerModel
      .find({
        _id: { $in: ids },
      })
      .lean();

    if (existingManagers.length !== ids.length) {
      return res.status(404).json({
        error: "یک یا چند مدیر پیدا نشد",
        success: false,
        found: existingManagers,
        requested: ids.length,
      });
    }

    const managersSchool = existingManagers.map((manager) => manager.school);

    const result = await managerModel.deleteMany({ _id: { $in: ids } });

    await teacherModel.deleteMany({ manager: { $in: ids } });
    await studentModel.deleteMany({ manager: { $in: ids } });
    await teacherAttendanceModel.deleteMany({ manager: { $in: ids } });
    await studentAttendanceModel.deleteMany({
      school: { $in: managersSchool },
    });

    console.log(managersSchool);

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} مدیر با موفقیت حذف شد`,
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(409).json({
        error: "خطای تکراری در پایگاه داده",
        success: false,
      });
    }

    if (error.name === "CastError") {
      return res.status(422).json({
        error: "فرمت آیدی نامعتبر است",
        success: false,
      });
    }

    return res.status(500).json({
      error: "خطای سرور داخلی",
      success: false,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
