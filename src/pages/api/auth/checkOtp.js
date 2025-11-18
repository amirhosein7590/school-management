import otpModel from "@/models/otp";
import connectToDb from "../../../../utils/db";

export default async function CheckOtp(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(422).json({ error: "کد مشخض نیست", success: false });
  }
  try {
    await connectToDb();
    const otp = await otpModel.findOne({ code });
    if (!otp) {
      return res.status(422).json({ error: "کد نادرست است", success: false });
    }
    if (otp?.resetTokenExp > Date.now()) {
      return res
        .status(400)
        .json({ error: "کد قبلا استفاده شده", success: false });
    }

    if (otp.expTime < Date.now()) {
      return res
        .status(410)
        .json({ error: "کد منقضی شده است", success: false });
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExp = Date.now() + Number(process.env.expReset);
    otp.resetToken = resetToken + process.env.salt;
    otp.resetTokenExp = resetTokenExp;
    await otp.save();
    return res
      .status(200)
      .json({ message: "کد تایید شد", resetToken, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
