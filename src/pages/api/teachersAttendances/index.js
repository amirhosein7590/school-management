import teacherAttendanceModel from "@/models/teacherAttendance";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function TeachersAttendances(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;

  try {
    await connectToDb();

    // ------------------ Manager validation ------------------
    const manager = await managerModel.findOne({ nationalCode }).lean();
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    // ------------------ Body validation ------------------
    const { attendances } = req.body; // date , teacher , status

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res
        .status(422)
        .json({ error: "فیلد یا مقدار نامعتبر است", success: false });
    }

    // ------------------ Validate all inputs ------------------
    for (const record of attendances) {
      if (!record.teacher || !record.date || !record.status) {
        return res.status(422).json({
          error: "برخی فیلدها ناقص هستند",
          success: false,
        });
      }

      if (record.status === "late" && !record.time) {
        return res.status(422).json({
          error: "برای تأخیر باید زمان ثبت شود",
          success: false,
        });
      }

      if (["excused", "other"].includes(record.status) && !record.description) {
        return res.status(422).json({
          error: "توضیحات لازم است",
          success: false,
        });
      }
    }

    // ------------------ Check teacher validity ------------------
    const teacherIds = [...new Set(attendances.map((a) => a.teacher))];

    const validTeachers = await teacherModel
      .find({
        _id: { $in: teacherIds },
        manager: manager._id,
      })
      .select("_id")
      .lean();

    if (validTeachers.length !== teacherIds.length) {
      return res.status(403).json({
        error: "برخی معلمان معتبر نیستند",
        success: false,
      });
    }

    // ------------------ Prevent duplicates ------------------
    const duplicates = await teacherAttendanceModel
      .find({
        teacher: { $in: teacherIds },
        date: { $in: attendances.map((a) => new Date(a.date)) },
      })
      .lean();

    if (duplicates.length > 0) {
      return res.status(409).json({
        error: "برخی غیبت‌ها قبلاً ثبت شده‌اند",
        success: false,
      });
    }

    // ------------------ Prepare data ------------------
    const prepared = attendances.map((a) => ({
      ...a,
      manager: manager._id,
      date: new Date(a.date),
    }));

    // ------------------ Insert in bulk ------------------
    await teacherAttendanceModel.insertMany(prepared, { ordered: false });

    return res.status(201).json({
      message: "غیبت‌ها با موفقیت ثبت شدند",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
