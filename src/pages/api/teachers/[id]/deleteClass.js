import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import RBAC from "@/utils/RBAC";
import classModel from "@/models/class";
import studentModel from "@/models/student";

export default async function deleteTeacherClass(req, res) {
  if (req.method != "POST") {
    return res.status(400).json({ error: "خطای ناشناخته", success: false });
  }
  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "معلم یافت نشد",
  });

  if (!auth) return;
  const { nationalCode } = auth;

  try {
    await connectToDb();
    const manager = await managerModel.findOne({ nationalCode });
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    const { id: teacherId } = req.query;
    const { classId } = req.body;

    const classInfo = await classModel.findOne({ _id: classId });
    if (!classInfo) {
      return res.status(404).json({ error: "کلاس یافت نشد", success: false });
    }
    const teacherInfo = await teacherModel.findOne({ _id: teacherId });
    if (!teacherInfo) {
      return res.status(404).json({ error: "معلم یافت نشد", success: false });
    }

    classInfo.teacher = null;
    teacherInfo.class = null;
    await classInfo.save();
    await teacherInfo.save();

    return res.json({
      message: "کلاس با موفقیت از معلم سلب شد",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}
