import studentModel from "@/models/student";
import studentAttendanceModel from "@/models/studentAttendance";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function attendanceAll(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = RBAC(req, res, ["owner", "teacher"], { status: false });
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
    const teacher = await teacherModel.findOne({ nationalCode }).lean();
    if (!teacher) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    const students = await studentModel.find({
      teacher: teacher._id,
      class: teacher.class,
    });
    if (students.length < 1) {
      return res.status(404).json({
        error: "برای کلاس شما کلاسی ثبت نشده است",
        success: false,
      });
    }
    const selectedDate = new Date(date).toISOString().slice(0, 10);

    const studentIds = students.map((student) => student._id);
    const duplicate = await studentAttendanceModel.find({
      student: { $in: studentIds },
      teacher: teacher._id,
      class: teacher.class,
      date: new Date(selectedDate),
    });

    if (duplicate.length > 0) {
      return res.status(422).json({
        error: `تعداد ${duplicate.length} غیبت قبلا ثبت شده است`,
        success: false,
      });
    }

    const query = studentIds.map((id) => ({
      student: id,
      status,
      date: new Date(selectedDate),
      teacher: teacher._id,
      class: teacher.class,
      school: teacher.school,
    }));

    await studentAttendanceModel.insertMany(query);
    await studentAttendanceModel
      .find({
        date: new Date(selectedDate),
        teacher: teacher._id,
        class: teacher.class,
      })
      .populate("student", "_id firstName lastName");
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
