import { isValidObjectId } from "mongoose";
import connectToDb from "@/utils/db";
import { verifyToken } from "@/utils/tokenConf";
import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";

export default async function BanManager(req, res) {
  if (req.method != "POST") {
    return res.status(400).json({ error: "خطای ناشناخته", success: false });
  }
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "لطفا وارد حساب کاربری خود شوید" });
  }
  if (!req.query?.id || !isValidObjectId(req.query?.id)) {
    return res.status(422).json({ error: "مدیر یافت نشد", success: false });
  }

  try {
    await connectToDb();

    const { nationalCode, role } = verifyToken(token);
    if (!nationalCode || !role) {
      return res.status(422).json({ error: "دسترسی غیر مجاز", success: false });
    }
    if (role != "owner") {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    const { isBanned } = req.body;

    if (typeof isBanned != "boolean") {
      return res.status(422).json({ error: "فرمت یا فیلد نامعتبر است" });
    }

    const manager = await managerModel.findOne({ _id: req.query?.id });
    if (!manager) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }
    const message = manager.isBanned ? "مدیر رفع بن شد" : "مدیر بن شد";
    manager.isBanned = isBanned;
    await manager.save();

    return res.json({ message, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
