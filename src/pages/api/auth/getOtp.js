import connectToDb from "@/utils/db";
import otpModel from "@/models/otp";
import sendSms from "@/utils/sendSms";
import findUserByProp from "@/utils/findUserByProp";
import crypto from "crypto";

export default async function GetOtp(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const { userName } = req.body;
  const isBodyPropsValid = req.body?.userName && req.body.userName.trim();
  if (!isBodyPropsValid) {
    return res
      .status(422)
      .json({ error: "نام کاربری الزامی است", success: false });
  }

  if (Object.keys(req.body).length != 1) {
    return res
      .status(422)
      .json({ error: "فیلد های ارسال شده نا معتبر است", success: false });
  }
  try {
    await connectToDb();

    const user = await findUserByProp("userName", userName);

    if (!user) {
      return res
        .status(401)
        .json({ error: "نام کاربری یافت نشد", success: false });
    }
    const formatedPhone =
      user.phone.slice(-3) + "****" + user.phone.slice(0, 4);

    if (user.role != "owner" && user.isBanned) {
      if (user.expTime < Date.now()) {
        return res
          .status(403)
          .json({ error: "اشتراک شما به پایان رسیده است", success: false });
      }

      return res
        .status(403)
        .json({ error: "حساب کاربری شما مسدود شده است", success: false });
    }

    const sendedCode = await otpModel.findOne({ phone: user.phone });
    if (sendedCode) {
      if (sendedCode.expTime > Date.now()) {
        return res
          .status(409)
          .json({ error: "کد قبلی هنوز منقضی نشده است", success: false });
      } else {
        await otpModel.findOneAndDelete({ phone: sendedCode.phone });
        const code = crypto.randomInt(99999);
        const expTime = Date.now() + Number(process.env.expOtpTime);
        const { success } = await sendSms({
          patternKey: process.env.otpPattern,
          phoneNumber: user.phone,
          param1: code,
        });

        if (!success) {
          return res
            .status(500)
            .json({ error: "خطا در ارسال پبامک", success: false });
        }
        await otpModel.create({ phone: user.phone, code, expTime });
        return res.json({
          message: "کد با موفقیت ارسال شد",
          success: true,
          phone: formatedPhone,
        });
      }
    }

    const code = Math.floor(10000 + Math.random() * 9999);
    const expTime = Date.now() + Number(process.env.expOtpTime);
    const { success } = await sendSms({
      patternKey: process.env.otpPattern,
      phoneNumber: user.phone,
      param1: code,
    });

    if (!success) {
      return res
        .status(500)
        .json({ error: "خطا در ارسال پبامک", success: false });
    }
    await otpModel.create({ phone: user.phone, code, expTime });
    return res.json({
      message: "کد با موفقیت ارسال شد",
      success: true,
      phone: formatedPhone,
    });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
