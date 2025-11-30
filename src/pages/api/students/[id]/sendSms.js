import managerModel from "@/models/manager";
import studentModel from "@/models/student";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import sendSms from "@/utils/sendSms";

export default async function SendSmd(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = await RBAC(req, res, ["manager", "owner"], {
    status: true,
    errorMessage: "دانش آموز یافت نشد",
  });
  if (!auth) return;

  const { nationalCode, role } = auth;
  if (!req.body.text?.trim()) {
    return res
      .status(422)
      .json({ error: "متن برای ارسال پیامک الزامی است", success: false });
  }

  try {
    await connectToDb();
    if (role == "manager") {
      const manager = await managerModel
        .findOne({ nationalCode })
        .populate("school", "name");
      if (!manager) {
        return res
          .status(403)
          .json({ error: "دسترسی غیر مجاز", success: false });
      }
      const student = await studentModel.findOne({
        _id: req.query?.id,
        school: manager.school,
      });
      if (!student) {
        return res
          .status(404)
          .json({ error: "دانش آموز یافت نشد", success: false });
      }
      const result = await sendSms({
        patternKey: false,
        phoneNumber: student.parentPhone,
        param1: "",
        param2: "",
        param3: "",
        text: req.body.text + "\n" + manager.school.name,
      });
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "خطا-پیامک ارسال نشد", success: false });
      }
      return res.json({ message: "پیامک با موفقیت ارسال شد", success: true });
    } else if (role == "teacher") {
      const teacher = await teacherModel
        .findOne({ nationalCode })
        .populate("school", "name");
      if (!teacher) {
        return res
          .status(403)
          .json({ error: "دسترسی غیر مجاز", success: false });
      }
      const student = await studentModel.findOne({
        _id: req.query?.id,
        class: teacher.class,
      });
      if (!student) {
        return res
          .status(404)
          .json({ error: "دانش آموز یافت نشد", success: false });
      }
      const result = await sendSms({
        patternKey: false,
        phoneNumber: student.parentPhone,
        param1: "",
        param2: "",
        param3: "",
        text: req.body.text + "\n" + teacher.school.name,
      });
      if (!result.success) {
        return res.status(400).json({
          error: "خطا-پیامک ارسال نشد",
          success: false,
        });
      }
      return res.json({
        message: "پیامک با موفقیت ارسال شد",
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
