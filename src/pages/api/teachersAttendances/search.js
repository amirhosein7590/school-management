import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import teacherAttendanceModel from "@/models/teacherAttendance";
import RBAC from "@/utils/RBAC";

export default async function SearchTeacherAttendance(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = RBAC(req, res, ["owner", "manager"], { status: false });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    const manager = await managerModel.findOne({ nationalCode });
    if (!manager) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }

    if (Object.keys(req.body).length < 1) {
      const today = new Date().toISOString().slice(0, 10);
      const attendances = await teacherAttendanceModel
        .find({
          date: new Date(today),
          manager: manager._id,
        })
        .populate("teacher", "_id firstName lastName");

      return res.json({ attendances, message: "موفق", success: true });
    }
    const exceptedProps = ["status", "teachers", "date"];

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
      manager: manager._id,
      date: new Date(selectedDate),
    };

    if (req.body?.status) {
      query.status = req.body?.status?.[0];
    }
    if (req.body?.teachers) {
      const { teachers, ...otherFields } = query;
      query = { ...otherFields };
      query.teacher = { $in: req.body.teachers };
    }

    const attendances = await teacherAttendanceModel
      .find(query)
      .populate("teacher", "_id firstName lastName");

    return res.json({ attendances, message: "موفق", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
