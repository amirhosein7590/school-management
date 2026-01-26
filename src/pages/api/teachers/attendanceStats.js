import teacherAttendanceModel from "@/models/teacherAttendance";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const auth = RBAC(req, res, ["manager"]);
  if (!auth) return;
  const { nationalCode } = auth;

  try {
    await connectToDb();

    // validate manager

    const manager = await managerModel.findOne({ nationalCode }).lean();
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    if (req.method !== "GET") {
      return res
        .status(405)
        .json({ error: "این درخواست مجاز نیست", success: false });
    }

    const threshold = 3;

    const absenceStatuses = ["absent"];

    const attendanceColl = teacherAttendanceModel.collection.name;
    const teacherColl = teacherModel.collection.name;
    const managerId = new mongoose.Types.ObjectId(manager._id);

    const absentPipeline = [
      { $match: { manager: managerId, status: { $in: absenceStatuses } } },
      { $group: { _id: "$teacher", count: { $sum: 1 } } },
      { $match: { count: { $gt: threshold } } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: teacherColl,
          localField: "_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          teacherId: "$_id",
          count: 1,
          teacher: {
            _id: "$teacher._id",
            firstName: "$teacher.firstName",
            lastName: "$teacher.lastName",
            nationalCode: "$teacher.nationalCode",
          },
        },
      },
    ];

    const mostLatePipeline = [
      { $match: { manager: managerId, status: "late" } },
      { $group: { _id: "$teacher", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: teacherColl,
          localField: "_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          teacherId: "$_id",
          count: 1,
          teacher: {
            _id: "$teacher._id",
            firstName: "$teacher.firstName",
            lastName: "$teacher.lastName",
            nationalCode: "$teacher.nationalCode",
          },
        },
      },
    ];

    const [
      absentOverThresholdResults,
      mostLateResults,
      distinctAbsentTeacherIds,
    ] = await Promise.all([
      teacherAttendanceModel.aggregate(absentPipeline).allowDiskUse(true),
      teacherAttendanceModel.aggregate(mostLatePipeline).allowDiskUse(true),
      teacherAttendanceModel.distinct("teacher", {
        manager: manager._id,
        status: { $in: absenceStatuses },
      }),
    ]);

    const neverAbsentMatch = {
      manager: manager._id,
      ...(distinctAbsentTeacherIds && distinctAbsentTeacherIds.length > 0
        ? { _id: { $nin: distinctAbsentTeacherIds } }
        : {}),
    };

    const neverAbsentTeachersArray = await teacherModel
      .find(neverAbsentMatch)
      .select("_id firstName lastName nationalCode")
      .lean();

    const neverAbsentTeachers = neverAbsentTeachersArray.map((t) => ({
      teacher: t,
    }));

    const mostLate = mostLateResults[0] || null;

    return res.json({
      success: true,
      data: {
        absentOverThreshold: absentOverThresholdResults, // array — ممکنه چند نفر باشن
        mostLate,
        neverAbsent: neverAbsentTeachers,
      },
    });
  } catch (error) {
    console.error("attendance-stats error:", error);
    return res.status(500).json({
      error: "خطای داخلی سرور",
      dbError: error?.message || error,
      success: false,
    });
  }
}
