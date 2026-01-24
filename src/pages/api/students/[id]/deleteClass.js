import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";
import classModel from "@/models/class";
import studentModel from "@/models/student";

export default async function deleteStudentClass(req, res) {
  if (req.method != "POST") {
    return res.status(400).json({ error: "خطای ناشناخته", success: false });
  }
  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "دانش آموز یافت نشد",
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
    const { id: studentId } = req.query;
    const { classId } = req.body;

    const classInfo = await classModel.findOne({ _id: classId });
    if (!classInfo) {
      return res.status(404).json({ error: "کلاس یافت نشد", success: false });
    }
    const studentInfo = await studentModel.findOne({ _id: studentId });
    if (!studentInfo) {
      return res
        .status(404)
        .json({ error: "دانش آموز یافت نشد", success: false });
    }

    studentInfo.class = null;
    studentInfo.teacher = null;
    await studentInfo.save();

    classInfo.capacity = classInfo.capacity + 1;
    await classInfo.save();

    return res.json({
      message: "کلاس با موفقیت از دانش آموز سلب شد",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}
