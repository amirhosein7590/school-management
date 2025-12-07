import managerModel from "@/models/manager";
import studentAttendanceModel from "@/models/studentAttendance";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function StudentAttendance(req, res) {
  if (req.method != "DELETE") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: true,
    errorMessage: "غیبت یافت نشد",
  });
  if (!auth) return;

  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    const attendance = await studentAttendanceModel
      .findOne({ _id: req.query.id })
      .populate("student", "manager")
      .lean();

    if (role == "manager") {
      const manager = await managerModel.findOne({ nationalCode });
      if (!manager) {
        return res
          .status(403)
          .json({ error: "دسترسی غیر مجاز", success: false });
      }
      if (attendance.student.manager.toString() != manager._id) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
    } else if (role == "teacher") {
      const teacher = await teacherModel.findOne({ nationalCode });
      if (!teacher) {
        return res
          .status(403)
          .json({ error: "دسترسی غیر مجاز", success: false });
      }
      if (attendance.class.toString() != teacher.class) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
    }

    await studentAttendanceModel.findOneAndDelete({ _id: req.query.id });
    return res.json({ message: "غیبت با موفقیت حذف شد", success: true });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
