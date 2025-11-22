import connectToDb from "@/utils/db";
import otpModel from "@/models/otp";
import sendSms from "@/utils/sendSms";
import findUserByProp from "@/utils/findUserByProp";

export default async function GetOtp(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const { phone } = req.body;
  const isBodyPropsValid = req.body?.phone && req.body.phone.trim();
  if (!isBodyPropsValid) {
    return res
      .status(422)
      .json({ error: "شماره تلفن مشخص نیست", success: false });
  }

  if (Object.keys(req.body).length != 1) {
    return res
      .status(422)
      .json({ error: "فیلد های ارسال شده نا معتبر است", success: false });
  }
  try {
    await connectToDb();

    const user = await findUserByProp("phone", phone);

    if (!user) {
      return res
        .status(401)
        .json({ error: "این شماره در سایت ثبت نشده است", success: false });
    }

    if (user.role != "owner" && user.isBanned) {
      if (user.expTime < Date.now()) {
        return res
          .status(403)
          .json({ error: "اشتراک شما به پایان رسیده است", success: false });
      }

      return res
        .status(403)
        .json({ error: "حساب کاربری شما بن شده است", success: false });
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
      .json({ error: "خطای ناشناخته", success: false });
  }
}
