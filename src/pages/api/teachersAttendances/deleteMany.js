import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import teacherAttendanceModel from "@/models/teacherAttendance";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";

export default async function deleteManyTeachersAttendances(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;

  const { nationalCode, role } = auth;

  if (!req.body || !req.body.ids) {
    return res
      .status(422)
      .json({ error: "آیدی معلمان الزامی است", success: false });
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
    const manager = await managerModel.findOne({ nationalCode }).lean();

    if (!manager) {
      return res.status(404).json({ error: "مدیر پیدا نشد", success: false });
    }

    const existingAttendances = await teacherAttendanceModel.find({
      _id: { $in: ids },
      manager: manager._id,
    });

    if (existingAttendances.length !== ids.length) {
      const existingIds = existingAttendances.map((c) => c._id.toString());
      const invalidIds = ids.filter((id) => !existingIds.includes(id));

      return res.status(403).json({
        error: "شما فقط می‌توانید غیبت معلمان مدرسه خود را حذف کنید",
        success: false,
        invalidIds,
        message: `شما فقط می‌توانید ${existingAttendances.length} معلم از ${ids.length} معلم را حذف کنید`,
      });
    }

    const result = await teacherAttendanceModel.deleteMany({
      _id: { $in: ids },
      manager: manager._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "هیچ غیبتی حذف نشد",
        success: false,
        details:
          "ممکن است غیبت معلم‌ها متعلق به مدرسه شما نباشند یا وجود نداشته باشند",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} غیبت با موفقیت حذف شد`,
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
