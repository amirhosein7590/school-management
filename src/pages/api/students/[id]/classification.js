import classModel from "@/models/class";
import managerModel from "@/models/manager";
import studentModel from "@/models/student";
import RBAC from "@/utils/RBAC";
import connectToDb from "@/utils/db";

export default async function StudentClassification(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({
      error: "این درخواست مجاز نیست",
      success: false,
    });
  }

  // --- RBAC ---
  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "آیدی نادرست است",
  });
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
    const { classId } = req.body;
    if (!classId?.trim()) {
      return res.status(422).json({
        error: "کلاس مشخص نشده است",
        success: false,
      });
    }

    // ---- Student ----
    const student = await studentModel.findOne(
      {
        _id: req.query.id,
        manager: manager._id,
        school: manager.school,
      },
      { _id: 1, class: 1 }
    );

    if (!student) {
      return res.status(404).json({
        error: "دانش آموز یافت نشد",
        success: false,
      });
    }

    // ---- Class ----
    const cls = await classModel.findOne(
      {
        _id: classId,
        manager: manager._id,
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
      class: classId,
    });

    if (count >= cls.capacity) {
      return res.status(403).json({
        error: "کلاس ظرفیت ندارد",
        success: false,
      });
    }

    // ---- Update Student ----
    await studentModel.updateOne(
      { _id: student._id },
      {
        class: classId,
        teacher: cls.teacher,
      }
    );

    return res.json({
      message: "دانش آموز با موفقیت به کلاس منتقل شد",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "خطای ناشناخته",
      success: false,
    });
  }
}
