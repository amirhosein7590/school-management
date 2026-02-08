import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
import { hashPassword, verifyPassword } from "@/utils/passwordConf";

export default async function changePassword(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "teacher", "manager"], {
    status: false,
  });

  if (!auth) return;
  const { nationalCode, role } = auth;
  const { oldPassword, newPassword, repeatPassword } = req.body;
  if (!oldPassword?.trim() || !newPassword?.trim()) {
    return res
      .status(422)
      .json({ error: "تمامی مقادیر الزامی هستند", success: false });
  }

  if (newPassword != repeatPassword) {
    return res
      .status(422)
      .json({ error: "تکرار رمز عبور نادرست است", success: false });
  }

  const models = {
    teacher: teacherModel,
    manager: managerModel,
    owner: ownerModel,
  };
  try {
    await connectToDb();
    const user = await models[role].findOne({ nationalCode });
    if (!user) {
      if (!user || user.role != role) {
        return res
          .status(401)
          .json({ error: "لطفا وارد حساب کاربری خود شوید", success: false });
      }
    }
    const isPasswordValid = await verifyPassword(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(422)
        .json({ error: "رمز عبور قبلی نادرست است", success: false });
    }
    const newHashedPassword = await hashPassword(newPassword);
    user.password = newHashedPassword;
    await user.save();
    return res.json({ message: "رمز عبور با موفقیت تغییر کرد", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
