import otpModel from "@/models/otp";
import connectToDb from "../../../../utils/db";
import { hashPassword } from "../../../../utils/passwordConf";
import findUserByProp from "../../../../utils/findUserByProp";

export default async function ResetPassword(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const { newPassword, repeatPassword, resetToken } = req.body;
  const excepteBodyProps = ["newPassword", "repeatPassword", "resetToken"];
  const isBodyPropsValid = excepteBodyProps.every(
    (prop) => req.body[prop] && req.body[prop.trim()]
  );

  if (!isBodyPropsValid) {
    return res.json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
  }

  if (newPassword != repeatPassword) {
    return res
      .status(422)
      .json({ error: "تکرار رمز عبور نادرست است", success: false });
  }

  try {
    await connectToDb();
    const hashedResetToken = resetToken + process.env.salt;
    const otp = await otpModel.findOne({ resetToken: hashedResetToken });
    if (!otp) {
      return res.status(404).json({
        error: "اطلاعات شما نامعبتر است",
        success: false,
      });
    }
    if (otp.resetTokenExp < Date.now()) {
      return res
        .status(410)
        .json({ error: "کد منقضی شده است", success: false });
    }
    const user = await findUserByProp("phone", otp.phone);
    if (!user) {
      return res
        .status(404)
        .json({ error: "کاربری با این شماره تلفن یافت نشد", success: false });
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    await otpModel.deleteOne({ _id: otp._id });
    return res
      .status(201)
      .json({ message: "رمز عبور با موفقیت تغییر کرد", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
