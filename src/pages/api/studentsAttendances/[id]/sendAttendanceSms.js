import managerModel from "@/models/manager";
import studentAttendanceModel from "@/models/studentAttendance";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import sendSms from "@/utils/sendSms";
import { isValidObjectId } from "mongoose";

export default async function SendAttendanceSms(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = RBAC(req, res, ["owner", "teacher"], {
    status: true,
    errorMessage: "غیبت یافت نشد",
  });
  if (!auth) return;

  const { nationalCode } = auth;

  try {
    await connectToDb();
    // ------------------ Teacher validation ------------------
    const teacher = await teacherModel.findOne({ nationalCode }).lean();
    if (!teacher) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    const manager = await managerModel.findOne({ _id: teacher.manager });
    if (!manager) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }
    if (manager.messagesCharge < 1) {
      return res.status(403).json({
        error:
          "شارژ بسته پیامکی به اتمام رسیده است ، لطفا به مدیر خود اطلاع بدهید",
        success: false,
      });
    }

    if (!isValidObjectId(req.query?.id)) {
      return res.status(404).json({ error: "غیبت یافت نشد", success: false });
    }

    const attendance = await studentAttendanceModel
      .findOne({
        _id: req.query.id,
        teacher: teacher._id,
        class: teacher.class,
      })
      .populate("student", "_id firstName lastName parentPhone");

    if (!attendance) {
      return res.status(404).json({ error: "غیبت یافت نشد", success: false });
    }

    if (attendance?.status == "present") {
      return res.status(403).json({
        error: "امکان ارسال پبامک غیبت برای وضعیت حاضر وجود ندارد",
        success: false,
      });
    }

    const studentFullName = `${attendance.student.firstName} ${attendance.student.lastName}`
    const d = new Date(attendance?.date.toISOString().slice(0, 10));
    const date = d.toLocaleDateString("FA");
    const status = attendance.status == "late" ? "تاخیر" : "غیبت"
    const sms = await sendSms({
      patternKey: "studentAbsent",
      phoneNumber: attendance?.student?.parentPhone,
      param1 : studentFullName,
      param2: date,
      param3: status,
    });

    if (!sms.Success) {
      return res.status(422).json({ error: "خطا در ارسال پیامک", su });
    }

    manager.messagesCharge = manager.messagesCharge - 1;
    await manager.save();

    return res
      .status(201)
      .json({ message: "پیامک غیبت ارسال شد", success: false });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
