import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import teacherModel from "@/models/teacher";
import RBAC from "@/utils/RBAC";

export default async function SearchClass(req, res) {
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
    if (role == "manager") {
      const manager = await managerModel.findOne({ nationalCode });
      if (!manager) {
        return res
          .status(403)
          .json({ error: "دسترسی غیر مجاز", success: false });
      }
      const teachers = await teacherModel.find({
        $or: [
          { firstName: { $regex: req.body.value, $options: "i" } },
          { lastName: { $regex: req.body.value, $options: "i" } },
          { phone: { $regex: req.body.value, $options: "i" } },
        ],
        school: manager.school,
      });
      return res.json({ teachers, success: true });
    } else {
      // owner
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
