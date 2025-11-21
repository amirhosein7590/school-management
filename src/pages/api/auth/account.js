import connectToDb from "@/utils/db";
import findUserByProps from "@/utils/findUserByProps";
import { hashPassword, verifyPassword } from "@/utils/passwordConf";
import RBAC from "@/utils/RBAC";
import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";

export default async function Account(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const exceptedProps = ["userName", "password", "oldPassword"];
  const isBodyPropValid = exceptedProps.every(
    (prop) => req.body[prop] && req.body[prop].trim()
  );

  if (!isBodyPropValid) {
    return res
      .status(422)
      .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
  }
  const auth = RBAC(req, res, ["owner", "teacher", "manager"], {
    status: false,
  });

  if (!auth) return;

  try {
    await connectToDb();
    const { nationalCode, role } = auth;
    const user = await findUserByProps({ nationalCode });
    if (!user || user.role != role) {
      return res
        .status(401)
        .json({ error: "لطفا وارد حساب کاربری خود شوید", success: false });
    }

    const { userName, password, oldPassword } = req.body;
    const isPasswordValid = await verifyPassword(oldPassword, user.password);

    if (!isPasswordValid) {
      return res
        .status(422)
        .json({ error: "رمز عبور قبلی نادرست است", success: false });
    }

    const hashedPassword = await hashPassword(password);
    let Model;
    if (user.role === "owner") Model = ownerModel;
    else if (user.role === "teacher") Model = teacherModel;
    else if (user.role === "manager") Model = managerModel;

    const update = await Model.findOneAndUpdate(
      { nationalCode },
      { userName, password: hashedPassword }
    );

    if (!update) {
      return res.status(404).json({ error: "کاربر یافت نشد", success: false });
    }

    return res.json({
      message: "اطلاعات حساب کاربری تغییر یافت",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
