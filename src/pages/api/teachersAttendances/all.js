import teacherAttendanceModel from "@/models/teacherAttendance";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function attendanceAll(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;

  try {
    const { status, date } = req.body;
    if (!status || !date) {
      return res
        .status(422)
        .json({ error: "تاریخ و وضعیت غیبت الزامی است", success: false });
    }

    await connectToDb();
    // ------------------ Manager validation ------------------
    const manager = await managerModel.findOne({ nationalCode }).lean();
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    if (!manager.actionsPermissions?.teacherAbsent) {
      return res.status(403).json({ error: "این عملیات از سوی مدیر سیستم محدود شده است", success: false })
    }

    const teachers = await teacherModel.find({
      manager: manager._id,
      school: manager.school,
    });
    if (teachers.length < 1) {
      return res.status(404).json({
        error: "برای مدرسه شما معلمی  ثبت نشده است",
        success: false,
      });
    }
    const selectedDate = new Date(date).toISOString().slice(0, 10);

    const teacherIds = teachers.map((teacher) => teacher._id);
    const duplicate = await teacherAttendanceModel.find({
      teacher: { $in: teacherIds },
      manager: manager._id,
      date: new Date(selectedDate),
    });

    if (duplicate.length > 0) {
      return res.status(422).json({
        error: `تعداد ${duplicate.length} غیبت قبلا ثبت شده است`,
        success: false,
      });
    }

    const query = teacherIds.map((id) => ({
      teacher: id,
      status,
      date: new Date(selectedDate),
      manager,
    }));

    await teacherAttendanceModel.insertMany(query);
    await teacherAttendanceModel
      .find({
        date: new Date(selectedDate),
        manager: manager._id,
      })
      .populate("teacher", "_id firstName lastName");
    return res.status(201).json({
      message: "عملیات با موفقیت انجام شد",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
