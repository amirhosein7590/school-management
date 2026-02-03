import studentModel from "@/models/student";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";
import studentAttendanceModel from "@/models/studentAttendance";

export default async function DeleteManyStudents(req, res) {
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
      .json({ error: "آیدی دانش آموزان الزامی است", success: false });
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

    let query = { _id: { $in: ids } };

    if (role === "manager") {
      const manager = await managerModel
        .findOne({ nationalCode })
        .select("school actionsPermissions.deleteStudent")
        .lean();

      if (!manager) {
        return res.status(404).json({ error: "مدیر پیدا نشد", success: false });
      }

      if (!manager.actionsPermissions?.deleteStudent) {
        return res
          .status(403)
          .json({ error: "شما مجوز حذف دانش آموز را ندارید", success: false });
      }

      if (!manager.school) {
        return res.status(403).json({
          error: "شما به مدرسه‌ای اختصاص داده نشده‌اید",
          success: false,
        });
      }

      query.school = manager.school;

      const existingStudents = await studentModel
        .find({
          _id: { $in: ids },
          school: manager.school,
        })
        .select("_id firstName lastName")
        .lean();

      if (existingStudents.length !== ids.length) {
        const existingIds = existingStudents.map((c) => c._id.toString());
        const invalidIds = ids.filter((id) => !existingIds.includes(id));

        return res.status(403).json({
          error: "شما فقط می‌توانید دانش آموزان خود را حذف کنید",
          success: false,
          invalidIds,
          message: `شما فقط می‌توانید ${existingStudents.length} دانش آموز از ${ids.length} دانش آموز را حذف کنید`,
        });
      }
    } else if (role === "owner") {
      const existingStudents = await studentModel
        .find({
          _id: { $in: ids },
        })
        .countDocuments();

      if (existingStudents !== ids.length) {
        return res.status(404).json({
          error: "یک یا چند دانش آموز پیدا نشد",
          success: false,
          found: existingStudents,
          requested: ids.length,
        });
      }
    }

    const result = await studentModel.deleteMany(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "هیچ دانش آموزی حذف نشد",
        success: false,
        details:
          "ممکن است دانش آموز‌ها متعلق به مدرسه شما نباشند یا وجود نداشته باشند",
      });
    }

    const { _id, ...otherFields } = query;

    await studentAttendanceModel.deleteMany({
      student: { $in: ids },
      ...otherFields,
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} دانش آموز با موفقیت حذف شد`,
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
