import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import teacherAttendanceModel from "@/models/teacherAttendance";

export default async function MostAbsentTeacher(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "متد مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;

  try {
    await connectToDb();

    const manager = await managerModel.findOne({ nationalCode }).lean();
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

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

    const result = await teacherAttendanceModel.aggregate([
      {
        $match: {
          manager: manager._id,
          date: {
            $gte: monthStart,
            $lte: monthEnd,
          },
          status: { $in: ["absent", "excused"] },
        },
      },
      {
        $group: {
          _id: "$teacher",
          totalAbsences: { $sum: 1 },
          dates: { $push: "$date" }, // برای دیباگ
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
          from: "teachers",
          localField: "_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $unwind: "$teacher",
      },
      {
        $project: {
          _id: 0,
          teacher: {
            _id: "$teacher._id",
            firstName: "$teacher.firstName",
            lastName: "$teacher.lastName",
            userName: "$teacher.userName",
            nationalCode: "$teacher.nationalCode",
          },
          totalAbsences: 1,
          dates: 1, // برای دیباگ
        },
      },
    ]);

    if (!result.length) {
      return res.json({
        message: "هیچ غیبتی در ماه جاری ثبت نشده است",
        success: true,
        teacher: null,
      });
    }

    return res.json({
      success: true,
      teacher: result[0],
    });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      success: false,
    });
  }
}
