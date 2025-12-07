import managerModel from "@/models/manager";
import teacherAttendanceModel from "@/models/teacherAttendance";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function TeacherAttendace(req, res) {
  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "غیبت یافت نشد",
  });
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

    switch (req.method) {
      case "DELETE": {
        const attendance = await teacherAttendanceModel.findOneAndDelete({
          _id: req.query?.id,
          manager: manager._id,
        });

        if (!attendance) {
          return res
            .status(404)
            .json({ error: "غیبت یافت نشد", success: false });
        }

        return res.json({ message: "غیبت با موفقیت حذف شد", success: false });
      }

      default: {
        return res.status(405).json({ error: "متد مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
