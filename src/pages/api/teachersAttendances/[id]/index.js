import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import teacherAttendanceModel from "@/models/teacherAttendance";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";

export default async function TeacherAttendace(req, res) {
  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "غیبت یافت نشد",
  });
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
        const attendance = await teacherAttendanceModel.findOne({
          _id: req.query?.id,
          manager: manager._id,
        });

        return res.json({ attendance, success: true });
      }

      case "PUT": {
        const statusConfig = {
          present: {
            requireProps: ["teacher", "date", "status"],
            message: "تمامی مقادیر الزامی است",
          },
          absent: {
            requireProps: ["teacher", "date", "status"],
            message: "تمامی مقادیر الزامی است",
          },
          other: {
            requireProps: ["description", "teacher", "date", "status"],
            message: "برای وضعیت سایر توضیحات الزامی است",
          },
          excused: {
            requireProps: ["description", "teacher", "date", "status"],
            message: "برای وضعیت غیبت موجه توضیحات الزامی است",
          },
          late: {
            requireProps: ["description", "time", "teacher", "date", "status"],
            message: "برای وضعیت تاخیر توضیحات و ساعت الزامی است",
          },
        };

        const { teacher, status, date } = req.body;
        const { id } = req.query;
        const validStatus = ["present", "absent", "excused", "late", "other"];
        if (!teacher || !validStatus.includes(status) || !date) {
          return res
            .status(422)
            .json({ error: "تمامی مقادیر الزامی هستند", success: false });
        }
        if (!isValidObjectId(teacher)) {
          return res
            .status(422)
            .json({ error: "آیدی معلم معتبر نیست", success: false });
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

        const attendance = await teacherAttendanceModel.findOne({
          _id: id,
          manager: manager._id,
          teacher,
        });

        if (!attendance) {
          return res
            .status(404)
            .json({ error: "غیبت یافت نشد", success: false });
        }

        const teacherInfo = await teacherModel.findOne({
          _id: teacher,
          manager: manager._id,
          school: manager.school,
        });

        if (!teacherInfo) {
          return res
            .status(404)
            .json({ error: "معلم یافت نشد", success: false });
        }

        await teacherAttendanceModel.updateOne(
          {
            _id: id,
            teacher,
            manager: manager._id,
          },
          { ...req.body, status, teacher, date }
        );

        return res
          .status(201)
          .json({ message: "عملیات با موفقیت انجام شد", success: true });
      }

      case "DELETE": {
        const attendance = await teacherAttendanceModel.findOneAndDelete({
          _id: req.query?.id,
          manager: manager._id,
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
