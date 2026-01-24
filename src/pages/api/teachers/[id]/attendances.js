import managerModel from "@/models/manager";
import teacherAttendanceModel from "@/models/teacherAttendance";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function TeacherAttendances(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "معلم یافت نشد",
  });

  if (!auth) return;

  const { nationalCode } = auth;
  const { fromDate, toDate } = req.body;

  if (isNaN(Date.parse(fromDate)) || isNaN(Date.parse(toDate))) {
    return res.status(422).json({
      error: "تاریخ معتبر نیست",
      success: false,
    });
  }
  try {
    await connectToDb();
    // ------------------ Manager validation ------------------
    const manager = await managerModel.findOne({ nationalCode }).lean();
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    const report = await teacherAttendanceModel
      .find({
        date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
        teacher: req.query.id,
        manager: manager._id,
      })
      .lean();

    const attendances = {
      absent: [],
      present: [],
      excused: [],
      late: [],
      other: [],
    };
    for (let att of report) {
      if (attendances[att.status]) {
        attendances[att.status].push(att);
      }
    }
    return res.json({ attendances, success: true });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
