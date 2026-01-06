import teacherModel from "@/models/teacher";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import { hashPassword } from "@/utils/passwordConf";

export default async function GroupAdding(req, res) {
  if (req.method !== "POST") {
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
    if (!manager) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    if (!manager.actionsPermissions?.createTeacher) {
      return res.status(403).json({
        error: "این عملیات از سوی مدیر سیستم محدود شده است",
        success: false,
      });
    }

    const { teachers } = req.body;
    if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
      return res
        .status(422)
        .json({ error: "فرمت یا مقدار فیلد نامعتبر است", success: false });
    }

    const exceptedProps = [
      "firstName",
      "lastName",
      "phone",
      "nationalCode",
      "personnelCode",
      "birthDay",
      "gender",
    ];

    for (const t of teachers) {
      const isValid = exceptedProps.every((key) => t[key]);
      if (!isValid) {
        return res
          .status(422)
          .json({ error: "فیلد یا مقدار نامعتبر است", success: false });
      }
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
      return res.status(409).json({
        error: "معلم تکراری وجود دارد",
        success: false,
      });
    }

    const preparedTeachers = await Promise.all(
      teachers.map(async (t) => ({
        ...t,
        school: manager.school,
        manager: manager._id,
        userName: t.nationalCode,
        password: await hashPassword(t.personnelCode),
      }))
    );

    await teacherModel.insertMany(preparedTeachers, {
      ordered: false,
    });

    return res.status(201).json({
      message: "معلمین با موفقیت ایجاد شدند",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
