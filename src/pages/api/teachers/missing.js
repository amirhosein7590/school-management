import connectToDb from "@/utils/db";
import teacherModel from "@/models/teacher";
import studentModel from "@/models/student";
import studentAttendanceModel from "@/models/studentAttendance";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";

export default async function TodayTeacherAttendanceReport(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = await RBAC(req, res, ["manager", "owner"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;
  try {
    await connectToDb();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const manager = await managerModel.findOne({ nationalCode });
    if (!manager) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }

    const teachers = await teacherModel.find({ school: manager.school }).lean();

    const report = [];

    for (let teacher of teachers) {
      const students = await studentModel.find({ teacher: teacher._id }).lean();
      const totalStudents = students.length;

      const attendance = await studentAttendanceModel
        .find({
          teacher: teacher._id,
          date: { $gte: today, $lt: tomorrow },
        })
        .lean();

      const marked = attendance.length;
      const missing = totalStudents - marked;

      let status = "";
      let percentIncomplete = 0;

      if (marked === 0) {
        status = "not-submitted";
      } else if (missing > 0) {
        status = "partial";
        percentIncomplete = Math.round((missing / totalStudents) * 100);
      } else {
        status = "complete";
      }

      if (status === "not-submitted" || status === "partial") {
        report.push({
          teacherId: teacher._id,
          fullName: `${teacher.firstName} ${teacher.lastName}`,
          status,
          percentIncomplete:
            status === "partial" ? percentIncomplete : undefined,
        });
      }
    }

    return res
      .status(200)
      .json({ date: today.toISOString().split("T")[0], report });
  } catch (err) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
