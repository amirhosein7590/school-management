import connectToDb from "@/utils/db";
import { verifyPassword } from "@/utils/passwordConf";
import { serialize } from "cookie";
import { generateRefreshToken, generateToken } from "@/utils/tokenConf";
import cookieOptions from "@/utils/cookieOptions";
import findUserByProp from "@/utils/findUserByProp";
export default async function Login(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const exceptedProps = ["userName", "password"];
  const isBodyPropValid = exceptedProps.every(
    (prop) => req.body[prop] && req.body[prop].trim()
  );

  if (!isBodyPropValid) {
    return res
      .status(422)
      .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
  }

  try {
    await connectToDb();

    const { userName, password } = req.body;

    const user = await findUserByProp("userName", userName);

    if (!user) {
      return res
        .status(401)
        .json({ error: "شما در سایت ثبت نام نیستید", success: false });
    }

    if (user.isBanned) {
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
