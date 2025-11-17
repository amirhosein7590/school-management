import ownerModel from "@/models/owner";
import connectToDb from "../../../../utils/db";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import { verifyPassword } from "../../../../utils/passwordConf";
import { serialize } from "cookie";
import {
  generateRefreshToken,
  generateToken,
} from "../../../../utils/tokenConf";
import cookieOptions from "../../../../utils/cookieOptions";

export default async function Login(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const { userName, password } = req.body;
  if (!userName.trim() || !password.trim()) {
    return res
      .status(422)
      .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
  }
  try {
    await connectToDb();

    const owner = await ownerModel.findOne({ userName });
    const manager = await managerModel.findOne({ userName });
    const teacher = await teacherModel.findOne({ userName });

    const user = owner || teacher || manager;

    if (!user) {
      return res
        .status(401)
        .json({ error: "شما در سایت ثبت نام نیستید", success: false });
    }

    if (user.role != "owner" && user.isBanned) {
      if (user.expTime < Date.now()) {
        return res
          .status(403)
          .json({ error: "اشتراک شما به پایان رسیده است", success: false });
      }

      return res
        .status(403)
        .json({ error: "حساب کاربری شما بن شده است", success: false });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(422)
        .json({ error: "رمز عبور نادرست است", success: false });
    }

    const token = generateToken({
      nationalCode: user.nationalCode,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      nationalCode: user.nationalCode,
      role: user.role,
    });

    return res
      .setHeader("Set-Cookie", [
        serialize("token", token, cookieOptions("token", "/", true)),
        serialize(
          "refreshToken",
          refreshToken,
          cookieOptions("refreshToken", "/", true)
        ),
      ])
      .json({ message: "با موفقیت وارد شدید", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
