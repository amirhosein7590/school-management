import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import RBAC from "@/utils/RBAC";

export default async function BanTeacher(req, res) {
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

    const { isBanned } = req.body;

    if (typeof isBanned != "boolean") {
      return res
        .status(422)
        .json({ error: "فرمت یا فیلد نامعتبر است", success: false });
    }

    const teacher = await teacherModel.findOne({
      _id: req.query?.id,
      school: manager.school,
      manager: manager._id,
    });
    if (!teacher) {
      return res.status(404).json({ error: "معلم یافت نشد", success: false });
    }
    const message = teacher.isBanned ? "معلم رفع بن شد" : "معلم بن شد";
    teacher.isBanned = isBanned;
    await teacher.save();

    return res.json({ message, success: true });
  } catch (error) { 
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
