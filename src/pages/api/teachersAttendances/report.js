import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import teacherAttendanceModel from "@/models/teacherAttendance";

export default async function Report(req, res) {
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

        const report = await teacherAttendanceModel
          .find({
            date: new Date(today),
            manager: manager._id,
          })
          .populate("teacher", "_id firstName lastName");

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

        const exceptedProps = ["status", "teachers", "fromDate", "toDate"];

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
          manager: manager._id,
          status: { $ne: "present" },
        };

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

        const report = await teacherAttendanceModel
          .find(query)
          .populate("teacher", "_id firstName lastName");
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
