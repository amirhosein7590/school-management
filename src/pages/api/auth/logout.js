import { serialize } from "cookie";
import cookieOptions from "../../../../utils/cookieOptions";

export default async function Logout(req, res) {
  if (req.method != "GET") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  return res
    .setHeader("Set-Cookie", [
      serialize("token", "", cookieOptions("token", "/", true, true)),
      serialize(
        "refreshToken",
        "",
        cookieOptions("refreshToken", "/", true, true)
      ),
    ])
    .json({ message: "با موفقیت خارج شدید", success: true });
}
