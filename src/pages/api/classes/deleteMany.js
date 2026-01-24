import classModel from "@/models/class";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";

export default async function DeleteManyClasses(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;

  const { nationalCode, role } = auth;

  if (!req.body || !req.body.ids) {
    return res
      .status(422)
      .json({ error: "آیدی کلاس‌ها الزامی است", success: false });
  }

  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res
      .status(422)
      .json({ error: "آیدی‌ها باید به صورت آرایه باشند", success: false });
  }

  if (ids.length === 0) {
    return res
      .status(422)
      .json({ error: "هیچ آیدی‌ای ارسال نشده است", success: false });
  }

  const isValidIds = ids.every((id) => isValidObjectId(id));
  if (!isValidIds) {
    return res
      .status(422)
      .json({ error: "یک یا چند آیدی معتبر نیست", success: false });
  }

  try {
    await connectToDb();

    let query = { _id: { $in: ids } };

    if (role === "manager") {
      const manager = await managerModel
        .findOne({ nationalCode })
        .select("school actionsPermissions.deleteClass")
        .lean();

      if (!manager) {
        return res.status(404).json({ error: "مدیر پیدا نشد", success: false });
      }

      if (!manager.actionsPermissions?.deleteClass) {
        return res
          .status(403)
          .json({ error: "شما مجوز حذف کلاس را ندارید", success: false });
      }

      if (!manager.school) {
        return res
          .status(403)
          .json({
            error: "شما به مدرسه‌ای اختصاص داده نشده‌اید",
            success: false,
          });
      }

      query.school = manager.school;

      const existingClasses = await classModel
        .find({
          _id: { $in: ids },
          school: manager.school,
        })
        .select("_id name grade")
        .lean();

      if (existingClasses.length !== ids.length) {
        const existingIds = existingClasses.map((c) => c._id.toString());
        const invalidIds = ids.filter((id) => !existingIds.includes(id));

        return res.status(403).json({
          error: "شما فقط می‌توانید کلاس‌های مدرسه خود را حذف کنید",
          success: false,
          invalidIds,
          message: `شما فقط می‌توانید ${existingClasses.length} کلاس از ${ids.length} کلاس را حذف کنید`,
        });
      }
    } else if (role === "owner") {
      const existingClasses = await classModel
        .find({
          _id: { $in: ids },
        })
        .countDocuments();

      if (existingClasses !== ids.length) {
        return res.status(404).json({
          error: "یک یا چند کلاس پیدا نشد",
          success: false,
          found: existingClasses,
          requested: ids.length,
        });
      }
    }

    const result = await classModel.deleteMany(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "هیچ کلاسی حذف نشد",
        success: false,
        details:
          "ممکن است کلاس‌ها متعلق به مدرسه شما نباشند یا وجود نداشته باشند",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} کلاس با موفقیت حذف شد`,
    });
  } catch (error) {

    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(409).json({
        error: "خطای تکراری در پایگاه داده",
        success: false,
      });
    }

    if (error.name === "CastError") {
      return res.status(422).json({
        error: "فرمت آیدی نامعتبر است",
        success: false,
      });
    }

    return res.status(500).json({
      error: "خطای سرور داخلی",
      success: false,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
