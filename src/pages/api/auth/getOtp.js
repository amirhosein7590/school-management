import connectToDb from "../../../../utils/db";
import otpModel from "@/models/otp";
import sendSms from "../../../../utils/sendSms";
import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";

export default async function GetOtp(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const { phone } = req.body;
  if (!phone.trim()) {
    return res
      .status(422)
      .json({ error: "شماره تلفن مشخص نیست", success: false });
  }
  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ phone });
    const manager = await managerModel.findOne({ phone });
    const teacher = await teacherModel.findOne({ phone });

    const isUserRegistered = owner || manager || teacher;

    if (!isUserRegistered) {
      return res
        .status(401)
        .json({ error: "این شماره در سایت ثبت نشده است", success: false });
    }

    const sendedCode = await otpModel.findOne({ phone });
    if (sendedCode) {
      if (sendedCode.expTime > Date.now()) {
        return res
          .status(409)
          .json({ error: "کد قبلی هنوز منقضی نشده است", success: false });
      } else {
        await otpModel.findOneAndDelete({ phone: sendedCode.phone });
        const code = Math.floor(10000 + Math.random() * 9999);
        const expTime = Date.now() + Number(process.env.expOtpTime);
        const { success } = await sendSms({
          patternKey: process.env.otpPattern,
          phoneNumber: phone,
          param1: code,
        });

        if (!success) {
          return res
            .status(500)
            .json({ error: "خطا در ارسال پبامک", success: false });
        }
        await otpModel.create({ phone, code, expTime });
        return res.json({ message: "کد با موفقیت ارسال شد", success: true });
      }
    }

    const code = Math.floor(10000 + Math.random() * 9999);
    const expTime = Date.now() + Number(process.env.expOtpTime);
    const { success } = await sendSms({
      patternKey: process.env.otpPattern,
      phoneNumber: phone,
      param1: code,
    });

    if (!success) {
      return res
        .status(500)
        .json({ error: "خطا در ارسال پبامک", success: false });
    }
    await otpModel.create({ phone, code, expTime });
    return res.json({ message: "کد با موفقیت ارسال شد", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}
