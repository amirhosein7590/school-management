import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function teacheresQuantity(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = RBAC(req, res, ["owner", "manager"], { status: false });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    const manager = await managerModel.findOne({ nationalCode });
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    const teachers = await teacherModel.countDocuments({
      school: manager.school,
      manager: manager._id,
    });

    return res.json({ message: `${teachers} نفر`, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
