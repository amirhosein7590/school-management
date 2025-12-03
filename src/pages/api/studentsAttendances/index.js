import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import studentAttendanceModel from "@/models/studentAttendance";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function StudentsAttendances(req, res) {
  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: false,
  });
  if (!auth) return;

  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    const { attendances } = req.body;

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res.status(422).json({
        error: "فیلد یا مقدار نامعتبر است",
        success: false,
      });
    }

    // ============================================================
    // =========================== PUT =============================
    // ============================================================
    if (req.method === "PUT") {
      // ----------- Validate input -----------
      for (const a of attendances) {
        if (!a.id || !a.status || !a.teacher || !a.class || !a.student) {
          return res.status(422).json({
            error: "اطلاعات ناقص است",
            success: false,
          });
        }
        if (a.status === "late" && !a.time) {
          return res.status(422).json({
            error: "برای تأخیر باید زمان ثبت شود",
            success: false,
          });
        }
        if (["excused", "other"].includes(a.status) && !a.description) {
          return res.status(422).json({
            error: "توضیحات لازم است",
            success: false,
          });
        }
      }

      // ----------- Role-based student filter -----------
      let allowFilter = {};

      if (role === "manager") {
        const manager = await managerModel.findOne({ nationalCode }).lean();
        allowFilter.school = manager.school.toString();
      }

      if (role === "teacher") {
        const teacher = await teacherModel.findOne({ nationalCode }).lean();
        allowFilter.class = teacher.class.toString();
      }

      // ----------- Find existing attendance records -----------
      const ids = attendances.map((a) => a.id);

      const existing = await studentAttendanceModel
        .find({ _id: { $in: ids } })
        .populate("student", "school class")
        .lean();

      if (existing.length !== ids.length) {
        return res.status(404).json({
          error: "برخی رکوردها یافت نشدند",
          success: false,
        });
      }

      // ----------- Check access permissions -----------
      for (const record of existing) {
        if (role === "manager") {
          if (record.student.school.toString() !== allowFilter.school) {
            return res.status(403).json({
              error: "دسترسی غیر مجاز",
              success: false,
            });
          }
        }

        if (role === "teacher") {
          if (record.student.class.toString() !== allowFilter.class) {
            return res.status(403).json({
              error: "دسترسی غیر مجاز",
              success: false,
            });
          }
        }
      }

      // ----------- Prepare bulkWrite operations -----------
      const operations = attendances.map((a) => ({
        updateOne: {
          filter: { _id: a.id },
          update: {
            $set: {
              ...a
            },
          },
        },
      }));

      await studentAttendanceModel.bulkWrite(operations);

      return res.status(200).json({
        message: "ویرایش با موفقیت انجام شد",
        success: true,
      });
    }

    // ============================================================
    // =========================== POST ============================
    // ============================================================
    if (req.method === "POST") {
      for (const a of attendances) {
        if (!a.student || !a.teacher || !a.date || !a.status) {
          return res.status(422).json({
            error: "اطلاعات ناقص است",
            success: false,
          });
        }
      }

      // Prevent duplicates
      const duplicates = await studentAttendanceModel.find({
        student: { $in: attendances.map((a) => a.student) },
        date: { $in: attendances.map((a) => new Date(a.date)) },
      });

      if (duplicates.length > 0) {
        return res.status(409).json({
          error: "برخی رکوردها قبلاً ثبت شده‌اند",
          success: false,
        });
      }

      const prepared = attendances.map((a) => ({
        ...a,
        date: new Date(a.date),
      }));

      await studentAttendanceModel.insertMany(prepared);

      return res.status(201).json({
        message: "با موفقیت ثبت شد",
        success: true,
      });
    }

    return res.status(405).json({
      error: "متد مجاز نیست",
      success: false,
    });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
