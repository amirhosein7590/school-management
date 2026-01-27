import cookieOptions from "@/utils/cookieOptions";
import findUserByProp from "@/utils/findUserByProp";
import {
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "@/utils/tokenConf";
import { serialize } from "cookie";

export default async function RefreshToken(req, res) {
  if (req.method != "GET") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({
      isLoggined: false,
      success: false,
      error: "لطفا وارد حساب کاربری خود شوید",
    });
  }

  const { nationalCode, role } = verifyToken(refreshToken);
  if (!nationalCode || !role) {
    return res
      .status(403)
      .json({ error: "دسترسی نامعتبر است", success: false });
  }
  const user = await findUserByProp("nationalCode", nationalCode);

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
      .json({ error: "حساب کاربری شما مسدود شده است", success: false });
  }

  const payload = { nationalCode, role, isBanned: user.isBanned };

  if (role == "manager") {
    payload.expTime = user.expTime;
  }

  const newToken = generateToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return res
    .status(200)
    .setHeader("Set-Cookie", [
      serialize("token", newToken, cookieOptions("token", "/", true, false)),
      serialize(
        "refreshToken",
        newRefreshToken,
        cookieOptions("refreshToken", "/", true, false)
      ),
    ])
    .json({ success: true });
}
