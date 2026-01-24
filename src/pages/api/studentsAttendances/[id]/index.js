import teacherModel from "@/models/teacher";
import studentAttendanceModel from "@/models/studentAttendance";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";
import studentModel from "@/models/student";

export default async function StudentAttendace(req, res) {
  const auth = RBAC(req, res, ["owner", "teacher"], {
    status: true,
    errorMessage: "غیبت یافت نشد",
  });
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

    switch (req.method) {
      case "GET": {
        const attendance = await studentAttendanceModel.findOne({
          _id: req.query?.id,
          teacher: teacher._id,
          class: teacher.class,
        });

        return res.json({ attendance, success: true });
      }

      case "PUT": {
        const statusConfig = {
          present: {
            requireProps: ["student", "date", "status"],
            message: "تمامی مقادیر الزامی است",
          },
          absent: {
            requireProps: ["student", "date", "status"],
            message: "تمامی مقادیر الزامی است",
          },
          other: {
            requireProps: ["description", "student", "date", "status"],
            message: "برای وضعیت سایر توضیحات الزامی است",
          },
          excused: {
            requireProps: ["description", "student", "date", "status"],
            message: "برای وضعیت غیبت موجه توضیحات الزامی است",
          },
          late: {
            requireProps: ["description", "time", "student", "date", "status"],
            message: "برای وضعیت تاخیر توضیحات و ساعت الزامی است",
          },
        };

        const { student, status, date } = req.body;
        const { id } = req.query;
        const validStatus = ["present", "absent", "excused", "late", "other"];
        if (!student || !validStatus.includes(status) || !date) {
          return res
            .status(422)
            .json({ error: "تمامی مقادیر الزامی هستند", success: false });
        }
        if (!isValidObjectId(student)) {
          return res
            .status(422)
            .json({ error: "آیدی دانش آموز معتبر نیست", success: false });
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

        const attendance = await studentAttendanceModel.findOne({
          _id: id,
          teacher: teacher._id,
          class: teacher.class,
          student,
        });

        if (!attendance) {
          return res
            .status(404)
            .json({ error: "غیبت یافت نشد", success: false });
        }

        const studentInfo = await studentModel.findOne({
          _id: student,
          teacher: teacher._id,
          class: teacher.class,
        });

        if (!studentInfo) {
          return res
            .status(404)
            .json({ error: "دانش آموز یافت نشد", success: false });
        }

        await studentAttendanceModel.updateOne(
          {
            _id: id,
            student,
            teacher: teacher._id,
            class: teacher.class,
          },
          { ...req.body, status, student, date }
        );

        return res
          .status(201)
          .json({ message: "عملیات با موفقیت انجام شد", success: true });
      }

      case "DELETE": {
        const attendance = await studentAttendanceModel.findOneAndDelete({
          _id: req.query?.id,
          teacher: teacher._id,
          class: teacher.class,
        });

        if (!attendance) {
          return res
            .status(404)
            .json({ error: "غیبت یافت نشد", success: false });
        }

        return res.json({ message: "غیبت با موفقیت حذف شد", success: false });
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
