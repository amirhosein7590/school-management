import messageModel from "@/models/message";
import connectToDb from "@/utils/db";
import findUserByProp from "@/utils/findUserByProp";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";

export default async function ReplayMessage(req, res) {
  try {
    if (req.method != "POST") {
      return res
        .status(405)
        .json({ error: "این درخواست مجاز نیست", success: false });
    }
    const { id } = req.query;
    const { text } = req.body;

    if (!id || !isValidObjectId(id)) {
      return res
        .status(422)
        .json({ error: "آیدی پیام نامعتبر است", success: false });
    }
    if (!text?.trim()) {
      return res
        .status(422)
        .json({ error: "برای ارسال پاسخ متن پیام الزامی است", success: false });
    }

    const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
      status: true,
      errorMessage: "پیام یافت نشد",
    });

    if (!auth) return;
    const { nationalCode } = auth;

    await connectToDb();

    const message = await messageModel.findOne({ _id: id });
    if (!message) {
      return res.status(404).json({ error: "پیام یافت نشد", success: false });
    }
    const user = await findUserByProp("nationalCode", nationalCode);
    if (!user) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }
    if (String(user._id) != message.receiver) {
      return res
        .status(403)
        .json({ error: "شما گیرنده این پیام نیستید", success: false });
    }

    message.replay = { text };
    await message.save();
    return res
      .status(201)
      .json({ message: "پاسخ با موفقیت ارسال شد", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
