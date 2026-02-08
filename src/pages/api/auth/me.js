import connectToDb from "@/utils/db";
import findUserByProp from "@/utils/findUserByProp";
import { verifyToken } from "@/utils/tokenConf";

export default async function GetMe(req, res) {
  try {
    if (req.method != "GET") {
      return res
        .status(400)
        .json({ error: "این درخواست مجاز نیست", success: false });
    }

    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ error: "لطفا وارد حساب کاربری خود شوید", success: false });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken?.nationalCode || !decodedToken?.role) {
      return res
        .status(409)
        .json({ error: "دسترسی شما نامعتبر است", success: false });
    }
    await connectToDb();



    const user = await findUserByProp("nationalCode" , decodedToken?.nationalCode , false)
    return res.json({ user, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
