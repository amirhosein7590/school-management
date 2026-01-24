import classModel from "@/models/class";
import managerModel from "@/models/manager";
import studentModel from "@/models/student";
import RBAC from "@/utils/RBAC";
import connectToDb from "@/utils/db";
import { isValidObjectId } from "mongoose";

export default async function StudentClassification(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({
      error: "این درخواست مجاز نیست",
      success: false,
    });
  }

  // --- RBAC ---
  const auth = RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;

  try {
    await connectToDb();

    // ---- Manager ----
    const manager = await managerModel.findOne(
      { nationalCode },
      { _id: 1, school: 1 }
    );

    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    // --- Validate body ---
    const { classId, studentIds } = req.body;
    if (!classId?.[0] || !isValidObjectId(classId?.[0])) {
      return res.status(422).json({
        error: "کلاس نامعتبر است",
        success: false,
      });
    }

    if (!studentIds || !Array.isArray(studentIds)) {
      return res
        .status(422)
        .json({ error: "آیدی دانش آموزان نامعتبر است", success: false });
    }

    const isStudentIdsValid = studentIds.every((id) => isValidObjectId(id));

    if (!isStudentIdsValid) {
      return res
        .status(422)
        .json({ error: "آیدی دانش آموزان نامعتبر است", success: false });
    }

    // ---- Class ----
    const cls = await classModel.findOne(
      {
        _id: classId?.[0],
        school: manager.school,
      },
      { capacity: 1, teacher: 1 }
    );

    if (!cls) {
      return res.status(404).json({
        error: "کلاس یافت نشد",
        success: false,
      });
    }

    // ---- Capacity Check ----
    const count = await studentModel.countDocuments({
      class: classId?.[0],
    });

    if (count > cls.capacity) {
      return res.status(403).json({
        error: "کلاس ظرفیت ندارد",
        success: false,
      });
    }

    if (!cls.teacher) {
      return res.status(409).json({
        error: "نخست باید کلاس بندی معلم انجام شود",
        success: false,
      });
    }

    // ---- Update Students ----

    const update = await studentModel.updateMany(
      {
        _id: { $in: studentIds },
        school: manager.school,
        manager: manager._id,
      },
      { class: classId?.[0], teacher: cls.teacher }
    );

    cls.capacity = cls.capacity - update.matchedCount;
    await cls.save();

    return res.json({
      message: "دانش آموزان با موفقیت به کلاس منتقل شدند",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: "خطای ناشناخته",
      success: false,
      dbError: error,
    });
  }
}
