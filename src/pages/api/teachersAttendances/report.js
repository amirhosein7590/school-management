import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import teacherAttendanceModel from "@/models/teacherAttendance";

export default async function Report(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager"], { status: false });

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
    const report = await teacherAttendanceModel.find({
      date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
      manager: manager._id,
    });

    return res.json({ report, success: true });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
