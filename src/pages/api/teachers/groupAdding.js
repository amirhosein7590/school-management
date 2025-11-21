import teacherModel from "@/models/teacher";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";

export default async function GroupAdding(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = await RBAC(req, res, ["owner", "manager"], { status: false });
  if (!auth) return;
  const { nationalCode } = auth;

  try {
    await connectToDb();
    const manager = await managerModel.findOne({ nationalCode });
    const { teachers } = await req.body;
    if (!teachers || !Array.isArray(teachers) || teachers.length < 1) {
      return res
        .status(422)
        .json({ error: "فرمت یا مقدار فیلد نامعتبر است", success: false });
    }
    await validateTeachers(res, teachers, manager._id, manager.school);
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    if (!manager.actionsPermissions?.createTeacher) {
      return res.status(403).json({
        error: "این عملیات از سوی مالک محدود شده است",
        success: false,
      });
    }

    for (const t of teachers) {
      const teacher = new teacherModel({
        ...t,
        school: manager.school,
        manager: manager._id,
      });
      await teacher.save();
    }
    return res
      .status(201)
      .json({ message: "معلمین با موفقیت ایجاد شدند", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}

async function validateTeachers(res, teachers, managerId, schoolId) {
  const exceptedProps = [
    "firstName",
    "lastName",
    "phone",
    "nationalCode",
    "personnelCode",
    "birthDay",
    "gender",
  ];
  for (const teacher of teachers) {
    const isValid = exceptedProps.every((key) => teacher[key]);
    if (!isValid)
      return res
        .status(422)
        .json({ error: "فیلد یا مقدار نامعتبر است", success: false });
  }
  const nationalCodes = teachers.map((t) => t.nationalCode);
  const phones = teachers.map((t) => t.phone);
  const personnelCodes = teachers.map((t) => t.personnelCode);

  const duplicates = await teacherModel.find({
    $or: [
      { nationalCode: { $in: nationalCodes } },
      { phone: { $in: phones } },
      { personnelCode: { $in: personnelCodes } },
    ],
  });

  if (duplicates.length > 0) {
    return res.status(400).json({
      error: "معلم تکراری وجود دارد",
      success: false,
      duplicates,
    });
  }

  return true;
}
