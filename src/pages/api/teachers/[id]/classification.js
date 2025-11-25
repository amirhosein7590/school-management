import classModel from "@/models/class";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import mongoose from "mongoose";

export default async function TeachersClassification(req, res) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = await RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "معلم یافت نشد",
  });
  if (!auth) return;

  const { nationalCode } = auth;

  try {
    await connectToDb();

    const manager = await managerModel.findOne(
      { nationalCode },
      { _id: 1, school: 1 }
    );
    if (!manager)
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });

    const { classId } = req.body;
    if (!classId?.trim()) {
      return res
        .status(422)
        .json({ error: "کلاس مشخص نشده است", success: false });
    }

    const teacher = await teacherModel.findOne(
      {
        _id: req.query.id,
        school: manager.school,
        manager: manager._id,
      },
      { _id: 1 }
    );
    if (!teacher)
      return res.status(404).json({ error: "معلم یافت نشد", success: false });

    const cls = await classModel.findOne(
      {
        _id: classId,
        school: manager.school,
        manager: manager._id,
      },
      { _id: 1 }
    );
    if (!cls)
      return res.status(404).json({ error: "کلاس یافت نشد", success: false });

    const session = await mongoose.startSession();
    session.startTransaction();

    await classModel.updateOne(
      { _id: classId },
      { teacher: teacher._id },
      { session }
    );

    await teacherModel.updateOne(
      { _id: teacher._id },
      { class: classId },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({ message: "عملیات موفقیت آمیز بود", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
