import studentAttendanceModel from "@/models/studentAttendance";
import managerModel from "@/models/manager";
import studentModel from "@/models/student";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";

const statusConfig = {
  present: {
    requireProps: ["students", "date", "status"],
    message: "تمامی مقادیر الزامی هستند",
  },
  absent: {
    requireProps: ["students", "date", "status"],
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
  const auth = RBAC(req, res, ["owner", "teacher"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;

  try {
    await connectToDb();

    // ------------------ Manager validation ------------------
    const teacher = await teacherModel.findOne({ nationalCode }).lean();
    if (!teacher) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    if (!teacher.class) {
      return res
        .status(403)
        .json({ error: "برای شما کلاسی تعریف نشده است", success: false });
    }

    switch (req.method) {
      case "GET": {
        const today = new Date().toISOString().slice(0, 10);
        if (req.query.page) {
          const page = Number(req.query.page);
          const limit = Number(req.query.limit) || 10;
          const skip = (page - 1) * limit;

          const [attendances, total] = await Promise.all([
            studentAttendanceModel
              .find({
                date: new Date(today),
                teacher: teacher._id,
                class: teacher.class,
              })
              .populate("student", "_id firstName lastName")
              .skip(skip)
              .limit(limit),
            studentAttendanceModel.countDocuments(),
          ]);

          return res.json({
            attendances,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        } else {
          const attendances = await studentAttendanceModel
            .find({
              date: new Date(today),
              teacher: teacher._id,
              class: teacher.class,
            })
            .populate("student", "_id firstName lastName");

          return res.json({ attendances });
        }
      }

      case "POST": {
        const { students, status: statusArray, date } = req.body;
        const status = statusArray?.[0];
        if (!Array.isArray(students) || !status || !date) {
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

        const studentsInfo = await studentModel.find({
          _id: { $in: students },
          teacher: teacher._id,
          class: teacher.class,
        });

        if (students?.length != studentsInfo.length) {
          return res
            .status(404)
            .json({ error: "برخی دانش آموزان یافت نشدند", success: false });
        }

        const selectedDate = new Date(date).toISOString().slice(0, 10);

        const duplicate = await studentAttendanceModel.find({
          student: { $in: students },
          teacher: teacher._id,
          class: teacher.class,
          date: new Date(selectedDate),
        });

        if (duplicate.length > 0) {
          return res.status(422).json({
            error: `تعداد ${duplicate.length} غیبت قبلا ثبت شده است`,
            success: false,
          });
        }

        for (let student of studentsInfo) {
          await studentAttendanceModel.create({
            ...req.body,
            student: student._id,
            teacher: teacher._id,
            class: teacher.class,
            status,
            date: new Date(selectedDate),
            school: teacher.school,
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
