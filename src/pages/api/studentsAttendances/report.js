import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import studentAttendanceModel from "@/models/studentAttendance";
import { isValidObjectId } from "mongoose";

export default async function Report(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: false,
  });

  if (!auth) return;

  const { nationalCode, role } = auth;
  const { fromDate, toDate, classId } = req.body;

  if (isNaN(Date.parse(fromDate)) || isNaN(Date.parse(toDate))) {
    return res.status(422).json({
      error: "تاریخ معتبر نیست",
      success: false,
    });
  }

  if (!classId?.trim() || !isValidObjectId(classId)) {
    return res.status(422).json({ error: "کلاس معتبر نیست", success: false });
  }

  try {
    await connectToDb();
    // ------------------ Manager validation ------------------
    if (role == "manager") {
      const manager = await managerModel.findOne({ nationalCode }).lean();
      if (!manager) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
    } else if (role == "teacher") {
      const teacher = await teacherModel.findOne({ nationalCode }).lean();
      if (!teacher) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
    }
    const report = await studentAttendanceModel.find({
      date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
      class: classId,
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
