import classModel from "@/models/class";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";

export default async function TeachersClassification(req, res) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = await RBAC(req, res, ["owner", "manager"], {
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
    const { classId } = req.body;
    if (!classId || !classId.trim()) {
      return res
        .status(422)
        .json({ error: "کلاس مشخص نشده است", success: false });
    }
    const teacher = await teacherModel.findOne({
      _id: req.query?.id,
      school: manager.school,
      manager: manager._id,
    });
    if (!teacher) {
      return res.status(404).json({ error: "معلم یافت نشد", success: false });
    }
    const Class = await classModel.findOne({
      _id: classId,
      school: manager.school,
    });
    if (!Class) {
      return res.status(404).json({ error: "کلاس یافت نشد", success: false });
    }
    Class.teacher = teacher._id;
    teacher.class = Class._id;
    await Class.save();
    await teacher.save();
    return res.json({ message: "عملیات موفقیت آمیز بود", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
