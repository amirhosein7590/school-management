import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import teacherModel from "@/models/teacher";
import studentAttendanceModel from "@/models/studentAttendance";

export default async function Report(req, res) {
  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: false,
  });

  if (!auth) return;

  const { nationalCode, role } = auth;

  try {
    await connectToDb();

    switch (req.method) {
      case "GET": {
        const today = new Date().toISOString().slice(0, 10);

        const query = { date: new Date(today) };
        if (role == "teacher") {
          const teacherInfo = await teacherModel.findOne({ nationalCode });
          if (!teacherInfo) {
            return res
              .status(403)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }
          if (!teacherInfo?.class) {
            return res
              .status(403)
              .json({ error: "برای شما کلاسی تعریف نشده است", success: false });
          }
          query.class = teacherInfo.class;
        } else if (role == "manager") {
          const manager = await managerModel.findOne({ nationalCode });
          if (!manager) {
            return res
              .status(403)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }
          query.school = manager.school;
        }
        const report = await studentAttendanceModel
          .find(query)
          .populate("student", "_id firstName lastName")
          .populate("class", "_id name");

        return res.json({ report });
      }

      case "POST": {
        if (!req.body?.fromDate || !req.body?.toDate) {
          return res.status(422).json({
            error: "برای گزارش تاریخ شروع و پایان باید مشخص شود",
            success: false,
          });
        }

        if (
          isNaN(Date.parse(req.body?.fromDate)) ||
          isNaN(Date.parse(req.body?.toDate))
        ) {
          return res.status(422).json({
            error: "تاریخ معتبر نیست",
            success: false,
          });
        }

        const exceptedProps = ["status", "students", "fromDate", "toDate"];

        const isBodyPropsValid = Object.keys(req.body).every((prop) =>
          exceptedProps.includes(prop)
        );
        if (!isBodyPropsValid) {
          return res
            .status(422)
            .json({ error: "مقادیر سرچ نامعتبر است", success: false });
        }

        let query = {
          ...req.body,
          date: {
            $gte: new Date(req.body.fromDate.slice(0, 10)),
            $lte: new Date(req.body.toDate.slice(0, 10)),
          },
          status: { $ne: "present" },
        };

        if (role == "teacher") {
          const teacherInfo = await teacherModel.findOne({ nationalCode });
          if (!teacherInfo) {
            return res
              .status(403)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }
          if (!teacherInfo?.class) {
            return res
              .status(403)
              .json({ error: "برای شما کلاسی تعریف نشده است", success: false });
          }
          query.class = teacherInfo.class;
        } else if (role == "manager") {
          const manager = await managerModel.findOne({ nationalCode });
          if (!manager) {
            return res
              .status(403)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }
          query.school = manager.school;
        }

        if (req.body?.teachers) {
          const { teachers, ...otherFields } = query;
          query = { ...otherFields };
          query.teacher = { $in: req.body.teachers };
        }

        if (req.body?.status?.[0]) {
          if (req.body?.status == "present") {
            query.status = { $ne: "present" };
          } else {
            query.status = req.body?.status?.[0];
          }
        }

        if (req.body?.fromDate || req.body?.toDate) {
          const { fromDate, toDate, ...otherFields } = query;
          query = { ...otherFields };
        }

        const report = await studentAttendanceModel
          .find(query)
          .populate("student", "_id firstName lastName")
          .populate("class", "_id name");
        return res.json({ report, success: true });
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
