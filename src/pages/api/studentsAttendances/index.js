import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import studentModel from "@/models/student";
import studentAttendanceModel from "@/models/studentAttendance";

export default async function StudentsAttendances(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: false,
  });
  if (!auth) return;

  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    // ------------------ Body validation ------------------
    const { attendances } = req.body; // date , teacher , status

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res
        .status(422)
        .json({ error: "فیلد یا مقدار نامعتبر است", success: false });
    }
    // ------------------ Validate all inputs ------------------
    for (const record of attendances) {
      if (!record.student || !record.date || !record.status || !record.class) {
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

    // ------------------ Check student validity ------------------
    const studentIds = [...new Set(attendances.map((a) => a.student))];

    const validStudents = await studentModel
      .find({
        _id: { $in: studentIds },
        class: req.body.attendances[0].class,
      })
      .select("_id")
      .lean();

    if (validStudents.length !== studentIds.length) {
      return res.status(403).json({
        error: "برخی دانش اموزان معتبر نیستند",
        success: false,
      });
    }

    // ------------------ Prevent duplicates ------------------
    const duplicates = await studentAttendanceModel
      .find({
        student: { $in: studentIds },
        date: { $in: attendances.map((a) => new Date(a.date)) },
      })
      .lean();

    if (duplicates.length > 0) {
      return res.status(409).json({
        error: "برخی غیبت‌ها قبلاً ثبت شده‌اند",
        success: false,
      });
    }

    const prepared = attendances.map((a) => ({
      ...a,
      date: new Date(a.date),
    }));

    if (role == "manager") {
      const manager = await managerModel.findOne({ nationalCode });
      if (!manager) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
    } else if (role == "teacher") {
      const teacher = await teacherModel.findOne({ nationalCode });
      if (!teacher) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
    }

    // ------------------ Insert in bulk ------------------
    await studentAttendanceModel.insertMany(prepared, { ordered: false });
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
