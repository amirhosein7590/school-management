import classModel from "@/models/class";
import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
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
      const classes = await classModel.find({
        name: { $regex: req.body.value, $options: "i" },
        school: manager.school,
      });
      return res.json({ classes, success: true });
    } else {
      // owner
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
