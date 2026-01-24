import classModel from "@/models/class";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import { isValidObjectId } from "mongoose";
import studentAttendanceModel from "@/models/studentAttendance";
import studentsAttendances from "@/pages/school/studentsAttendances";
import studentModel from "@/models/student";

export default async function TeachersClassification(req, res) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = await RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;

  try {
    await connectToDb();
    const { teacherId, classId } = req.body;
    if (
      !teacherId ||
      !isValidObjectId(teacherId[0]) ||
      !classId ||
      !isValidObjectId(classId[0])
    ) {
      return res
        .status(422)
        .json({ error: "اطلاعات معلم یا کلاس نامعتبر است", success: false });
    }
    const manager = await managerModel.findOne({ nationalCode });
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    const classInfo = await classModel.findOne({ _id: classId[0] });
    if (!classInfo) {
      return res.status(404).json({ error: "کلاس یافت نشد", success: false });
    }

    if (classInfo.teacher) {
      return res.status(403).json({
        error: "برای هر معلم فقط یک کلاس می تواند تعریف شود",
        success: false,
      });
    }

    if (isValidObjectId(classInfo.teacher)) {
      const teacher = await teacherModel.findOne({
        _id: classInfo.teacher,
        school: manager.school,
        manager: manager._id,
      });
      if (teacher) {
        return res.status(409).json({
          error: `این کلاس متعلق به ${teacher.firstName} ${teacher.lastName} است`,
          success: false,
        });
      }
    }

    const teacherInfo = await teacherModel.findOne({ _id: teacherId[0] });
    if (!teacherInfo) {
      return res.status(404).json({ error: "معلم یافت نشد", success: false });
    }
    if (teacherInfo?.class) {
      return res.status(403).json({
        error: "برای هر معلم فقط یک کلاس می تواند تعریف شود",
        success: false,
      });
    }
    classInfo.teacher = teacherInfo._id;
    teacherInfo.class = classInfo._id;
    await classInfo.save();
    await teacherInfo.save();

    await studentAttendanceModel.updateMany(
      { class: teacherInfo.class },
      { teacher: teacherInfo._id }
    );
    await studentModel.updateMany(
      { class: teacherInfo.class },
      { teacher: teacherInfo._id }
    );
    return res.json({
      message: "معلم با موفقیت به کلاس منتقل شد",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
