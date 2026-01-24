import teacherAttendanceModel from "@/models/teacherAttendance";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

const statusConfig = {
  present: {
    requireProps: ["teachers", "date", "status"],
    message: "تمامی مقادیر الزامی هستند",
  },
  absent: {
    requireProps: ["teachers", "date", "status"],
    message: "تمامی مقادیر الزامی هستند",
  },
  excused: {
    requireProps: ["description"],
    message: "برای وضعیت غیبت موجه توضیحات الزامی است",
  },
  other: {
    requireProps: ["description"],
    message: "برای وضعیت سایر توضیحات الزامی است",
  },
  late: {
    requireProps: ["description", "time"],
    message: "برای وضعیت غیبت موجه توضیحات و ساعت الزامی است",
  },
};

export default async function TeachersAttendances(req, res) {
  const auth = RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;

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

    switch (req.method) {
      case "GET": {
        const today = new Date().toISOString().slice(0, 10);
        if (req.query.page) {
          const page = Number(req.query.page);
          const limit = Number(req.query.limit) || 10;
          const skip = (page - 1) * limit;

          const [attendances, total] = await Promise.all([
            teacherAttendanceModel
              .find({
                date: new Date(today),
                manager: manager._id,
              })
              .populate("teacher", "_id firstName lastName")
              .skip(skip)
              .limit(limit),
            teacherAttendanceModel.countDocuments(),
          ]);

          return res.json({
            attendances,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        } else {
          const attendances = await teacherAttendanceModel
            .find({
              date: new Date(today),
              manager: manager._id,
            })
            .populate("teacher", "_id firstName lastName");

          return res.json({ attendances });
        }
      }

      case "POST": {
        const { teachers, status: statusArray, date } = req.body;
        const status = statusArray?.[0];
        if (!Array.isArray(teachers) || !status || !date) {
          return res
            .status(422)
            .json({ error: "تمامی مقادیر الزامی هستند", success: false });
        }

        if (statusConfig[status]) {
          const config = statusConfig[status];
          const isPropsValid = config.requireProps.every(
            (prop) => req.body[prop]
          );

          if (!isPropsValid) {
            return res
              .status(422)
              .json({ error: config.message, success: false });
          }
        }

        const teachersInfo = await teacherModel.find({
          _id: { $in: teachers },
          manager: manager._id,
        });

        if (teachers?.length != teachersInfo.length) {
          return res
            .status(404)
            .json({ error: "برخی معلمان یافت نشدند", success: false });
        }

        const selectedDate = new Date(date).toISOString().slice(0, 10);

        const duplicate = await teacherAttendanceModel.find({
          teacher: { $in: teachers },
          manager: manager._id,
          date: new Date(selectedDate),
        });

        if (duplicate.length > 0) {
          return res.status(422).json({
            error: `تعداد ${duplicate.length} غیبت قبلا ثبت شده است`,
            success: false,
          });
        }

        for (let teacher of teachersInfo) {
          await teacherAttendanceModel.create({
            ...req.body,
            teacher: teacher._id,
            manager: teacher.manager,
            status,
            date: new Date(selectedDate),
          });
        }
        return res
          .status(201)
          .json({ message: "عملیات با موفقیت انجام شد", success: true });
      }

      default: {
        return res
          .status(405)
          .json({ error: "این درخواست مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      dbError: error,
      success: false,
    });
  }
}
