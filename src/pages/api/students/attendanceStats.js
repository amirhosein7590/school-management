// pages/api/attendance/student-stats.js
import studentAttendanceModel from "@/models/studentAttendance";
import studentModel from "@/models/student";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const auth = RBAC(req, res, ["manager", "teacher"]);
  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();

    // 1) تعیین حوزه (manager یا teacher) و گرفتن همه student ids مربوطه
    let studentFilter = {};
    if (role === "manager") {
      const managerDoc = await managerModel.findOne({ nationalCode }).lean();
      if (!managerDoc) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
      studentFilter = { manager: managerDoc._id };
    } else if (role === "teacher") {
      const teacherDoc = await teacherModel.findOne({ nationalCode }).lean();
      if (!teacherDoc) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
      studentFilter = { teacher: teacherDoc._id, manager: teacherDoc.manager };
    } else {
      return res.status(403).json({ error: "نقش نامعتبر", success: false });
    }

    if (req.method !== "GET") {
      return res
        .status(405)
        .json({ error: "این درخواست مجاز نیست", success: false });
    }

    const threshold = Number(req.query.threshold) || 3;
    const absenceStatuses = ["absent", "other"];

    const students = await studentModel
      .find(studentFilter)
      .select("_id firstName lastName nationalCode class teacher")
      .lean();
    const allStudentIds = students.map((s) => s._id).filter(Boolean);
    if (!allStudentIds.length) {
      return res.json({
        success: true,
        data: { absentOverThreshold: [], mostLate: null, neverAbsent: [] },
        meta: { threshold, totalStudents: 0 },
      });
    }

    const allStudentObjectIds = allStudentIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const absentAgg = [
      {
        $match: {
          student: { $in: allStudentObjectIds },
          status: { $in: absenceStatuses },
        },
      },
      { $group: { _id: "$student", absentCount: { $sum: 1 } } },
      { $match: { absentCount: { $gt: threshold } } },
      { $sort: { absentCount: -1 } },
      {
        $lookup: {
          from: studentModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          absentCount: 1,
          student: {
            _id: "$student._id",
            firstName: "$student.firstName",
            lastName: "$student.lastName",
            nationalCode: "$student.nationalCode",
            class: "$student.class",
            teacher: "$student.teacher",
          },
        },
      },
    ];

    const lateAgg = [
      { $match: { student: { $in: allStudentObjectIds }, status: "late" } },
      { $group: { _id: "$student", lateCount: { $sum: 1 } } },
      { $sort: { lateCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: studentModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          lateCount: 1,
          student: {
            _id: "$student._id",
            firstName: "$student.firstName",
            lastName: "$student.lastName",
            nationalCode: "$student.nationalCode",
            class: "$student.class",
            teacher: "$student.teacher",
          },
        },
      },
    ];

    const absentIdsAgg = [
      {
        $match: {
          student: { $in: allStudentObjectIds },
          status: { $in: absenceStatuses },
        },
      },
      { $group: { _id: "$student" } },
      { $project: { _id: 1 } },
    ];

    const [absentOverThresholdResults, mostLateResults, absentIdDocs] =
      await Promise.all([
        studentAttendanceModel.aggregate(absentAgg).allowDiskUse(true),
        studentAttendanceModel.aggregate(lateAgg).allowDiskUse(true),
        studentAttendanceModel.aggregate(absentIdsAgg).allowDiskUse(true),
      ]);

    const absentIdSet = new Set(
      (absentIdDocs || []).map((d) => d._id.toString())
    );

    const neverAbsentStudentsArray = students.filter(
      (s) => !absentIdSet.has(s._id.toString())
    );

    const neverAbsentStudents = neverAbsentStudentsArray.map((s) => ({
      student: s,
    }));

    const mostLate = mostLateResults[0] || null;

    return res.json({
      success: true,
      data: {
        absentOverThreshold: absentOverThresholdResults,
        mostLate,
        neverAbsent: neverAbsentStudents,
      },
    });
  } catch (error) {
    console.error("student-attendance-stats error:", error);
    return res.status(500).json({
      error: "خطای داخلی سرور",
      dbError: error?.message || error,
      success: false,
    });
  }
}
