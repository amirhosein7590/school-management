import ownerModel from "@/models/owner";
import connectToDb from "../../../../utils/db";
import managerModel from "@/models/manager";
import { verifyPassword } from "../../../../utils/passwordConf";
import { serialize } from "cookie";
import {
  generateRefreshToken,
  generateToken,
} from "../../../../utils/tokenConf";

export default async function Login(req, res) {
  try {
    await connectToDb();
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

    const owner = await ownerModel.findOne({ userName });
    const manager = await managerModel.findOne({ userName });
    const teacher = await teacherModel.findOne({ userName });

    const user = owner || teacher || manager;

    if (!user) {
      return res
        .status(401)
        .json({ error: "شما در سایت ثبت نام نیستید", success: false });
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
        serialize("token", token, {
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24,
        }),
        serialize("refreshToken", refreshToken, {
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
        }),
      ])
      .json({ message: "با موفقیت وارد شدید", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
