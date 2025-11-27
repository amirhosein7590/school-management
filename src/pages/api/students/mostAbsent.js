import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import studentAttendanceModel from "@/models/studentAttendance";
import mongoose from "mongoose";

export default async function MostAbsentTeacher(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: false,
  });
  if (!auth) return;

  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    if (role == "manager") {
      if (!req.query?.classId) {
        return res
          .status(422)
          .json({ error: "کلاس مشخص نشده است", success: false });
      }
      const manager = await managerModel.findOne({ nationalCode }).lean();
      if (!manager) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
      const result = await studentAttendanceModel.aggregate([
        {
          $match: {
            class: new mongoose.Types.ObjectId(req.query?.classId),
            date: {
              $gte: monthStart,
              $lte: monthEnd,
            },
            status: { $in: ["absent", "excused"] },
          },
        },
        {
          $group: {
            _id: "$student",
            totalAbsences: { $sum: 1 },
            dates: { $push: "$date" },
          },
        },
        {
          $sort: { totalAbsences: -1 },
        },
        {
          $limit: 1,
        },
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $unwind: "$student",
        },
        {
          $project: {
            _id: 0,
            student: {
              _id: "$student._id",
              firstName: "$student.firstName",
              lastName: "$student.lastName",
              userName: "$student.userName",
              nationalCode: "$student.nationalCode",
            },
            totalAbsences: 1,
            dates: 1,
          },
        },
      ]);

      if (!result.length) {
        return res.json({
          message: "هیچ غیبتی در ماه جاری ثبت نشده است",
          success: true,
          student: null,
        });
      }

      return res.json({
        success: true,
        student: result[0],
      });
    } else if (role == "teacher") {
      const teacher = await teacherModel.findOne({ nationalCode }).lean();
      if (!teacher) {
        return res.status(403).json({
          error: "شما مجاز به انجام این عملیات نیستید",
          success: false,
        });
      }
      const result = await studentAttendanceModel.aggregate([
        {
          $match: {
            class: new mongoose.Types.ObjectId(teacher.class),
            date: {
              $gte: monthStart,
              $lte: monthEnd,
            },
            status: { $in: ["absent", "excused"] },
          },
        },
        {
          $group: {
            _id: "$student",
            totalAbsences: { $sum: 1 },
            dates: { $push: "$date" },
          },
        },
        {
          $sort: { totalAbsences: -1 },
        },
        {
          $limit: 1,
        },
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $unwind: "$student",
        },
        {
          $project: {
            _id: 0,
            student: {
              _id: "$student._id",
              firstName: "$student.firstName",
              lastName: "$student.lastName",
              userName: "$student.userName",
              nationalCode: "$student.nationalCode",
            },
            totalAbsences: 1,
            dates: 1,
          },
        },
      ]);

      if (!result.length) {
        return res.json({
          message: "هیچ غیبتی در ماه جاری ثبت نشده است",
          success: true,
          student: null,
        });
      }

      return res.json({
        success: true,
        student: result[0],
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      success: false,
    });
  }
}
