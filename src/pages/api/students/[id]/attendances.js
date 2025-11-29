import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import studentModel from "@/models/student";
import studentAttendanceModel from "@/models/studentAttendance";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";

export default async function StudentAttendances(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: true,
  });

  if (!auth) return;

  const { nationalCode, role } = auth;
  const {fromDate, toDate } = req.body;

  // ------------------ Validate Inputs ------------------
  if (!isValidObjectId(req.query?.id)) {
    return res.status(422).json({ error: "آیدی دانش آموز معتبر نیست", success: false });
  }

  if (isNaN(Date.parse(fromDate)) || isNaN(Date.parse(toDate))) {
    return res.status(422).json({
      error: "تاریخ معتبر نیست",
      success: false,
    });
  }

  try {
    await connectToDb();

    // ------------------ Role Validation ------------------
    let allowedClass = null;

    if (role === "manager") {
      const manager = await managerModel.findOne({ nationalCode }).lean();
      if (!manager) {
        return res.status(403).json({ error: "دسترسی ندارید", success: false });
      }
      // مدیر به همه کلاس‌ها دسترسی دارد
    }

    if (role === "teacher") {
      const teacher = await teacherModel.findOne({ nationalCode }).lean();
      if (!teacher) {
        return res.status(403).json({ error: "دسترسی ندارید", success: false });
      }
      if (!teacher.class) {
        return res.status(400).json({
          error: "معلم نخست باید کلاس‌بندی شود",
          success: false,
        });
      }
      allowedClass = teacher.class;
    }

    // ------------------ Student Validation ------------------
    const student = await studentModel.findById(req.query?.id).lean();
    if (!student) {
      return res.status(404).json({ error: "دانش آموز یافت نشد", success: false });
    }

    // اگر teacher باشد باید دانش آموز حتماً در کلاس خودش باشد
    if (role === "teacher" && student.class.toString() !== allowedClass.toString()) {
      return res.status(403).json({
        error: "شما به این دانش آموز دسترسی ندارید",
        success: false,
      });
    }

    // ------------------ Generate Report ------------------
    const report = await studentAttendanceModel
      .find({
        student: req.query?.id,
        date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
      })
      .populate('student' , '_id firstName lastName')
      .populate('class' , '_id name')
      .populate('teacher' , '_id firstName lastName')
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

    return res.json({ success: true, attendances });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error.message,
      success: false,
    });
  }
}
