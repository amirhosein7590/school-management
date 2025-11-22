import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";

export default async function TeacherPermissions(req, res) {
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
    const teacher = await teacherModel.findOne({
      _id: req.query?.id,
      school: manager.school,
      manager: manager._id,
    });
    if (!teacher) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }

    const validKeys = Object.keys(teacher.actionsPermissions);
    const bodyKeys = Object.keys(req.body);

    for (const key of bodyKeys) {
      if (!validKeys.includes(key)) {
        return res
          .status(422)
          .json({ error: "فیلد نامعتبر است", success: false });
      }
    }

    teacher.actionsPermissions = {
      ...teacher.actionsPermissions,
      ...req.body,
    };

    teacher.save();

    return res.json({ message: "محدودیت با موفقیت اعمال شد", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
