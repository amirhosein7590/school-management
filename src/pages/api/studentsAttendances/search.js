import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import studentAttendanceModel from "@/models/studentAttendance";
import RBAC from "@/utils/RBAC";

export default async function SearchStudentAttendance(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = RBAC(req, res, ["owner", "teacher"], { status: false });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    const teacher = await teacherModel.findOne({ nationalCode });
    if (!teacher) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }

    if (Object.keys(req.body).length < 1) {
      const today = new Date().toISOString().slice(0, 10);
      const attendances = await studentAttendanceModel
        .find({
          date: new Date(today),
          teacher: teacher._id,
          class: teacher.class,
        })
        .populate("student", "_id firstName lastName");

      return res.json({ attendances, message: "موفق", success: true });
    }
    const exceptedProps = ["status", "students", "date"];

    const isBodyPropsValid = Object.keys(req.body).every((prop) =>
      exceptedProps.includes(prop)
    );
    if (!isBodyPropsValid) {
      return res
        .status(422)
        .json({ error: "مقادیر سرچ نامعتبر است", success: false });
    }

    if (!req.body?.date) {
      return res.status(422).json({ error: "تاریخ مشخص نیست", success: false });
    }
    const selectedDate = new Date(req.body.date).toISOString().slice(0, 10);
    let query = {
      ...req.body,
      teacher: teacher._id,
      class: teacher.class,
      date: new Date(selectedDate),
    };

    if (req.body?.status) {
      query.status = req.body?.status?.[0];
    }
    if (req.body?.students) {
      const { students, ...otherFields } = query;
      query = { ...otherFields };
      query.student = { $in: req.body.students };
    }

    const attendances = await studentAttendanceModel
      .find(query)
      .populate("student", "_id firstName lastName");

    return res.json({ attendances, message: "موفق", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
