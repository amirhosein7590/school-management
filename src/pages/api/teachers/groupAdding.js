import teacherModel from "@/models/teacher";
import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";

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

    const manager = await managerModel.findOne(
      { nationalCode },
      {
        actionsPermissions: 1,
        school: 1,
        _id: 1
      }
    ).lean();

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

    const validationErrors = [];
    const teachersData = [];
    const seenNationalCodes = new Set();
    const seenPhones = new Set();
    const seenPersonnelCodes = new Set();

    for (const t of teachers) {
      const isValid = exceptedProps.every(key =>
        t[key] && String(t[key]).trim() !== ''
      );

      if (!isValid) {
        validationErrors.push(`معلم با کد ${t.nationalCode || 'ناشناخته'} فیلدهای ضروری ندارد`);
        continue;
      }

      const nationalCodeStr = String(t.nationalCode).trim();
      const phoneStr = String(t.phone).trim();
      const personnelCodeStr = String(t.personnelCode).trim();

      if (
        seenNationalCodes.has(nationalCodeStr) ||
        seenPhones.has(phoneStr) ||
        seenPersonnelCodes.has(personnelCodeStr)
      ) {
        validationErrors.push(`معلم ${nationalCodeStr} تکراری است`);
        continue;
      }

      seenNationalCodes.add(nationalCodeStr);
      seenPhones.add(phoneStr);
      seenPersonnelCodes.add(personnelCodeStr);

      teachersData.push({
        ...t,
        nationalCode: nationalCodeStr,
        phone: phoneStr,
        personnelCode: personnelCodeStr
      });
    }

    if (validationErrors.length > 0) {
      return res.status(422).json({
        error: "خطا در اعتبارسنجی",
        details: validationErrors.slice(0, 5),
        success: false
      });
    }

    const existingTeachers = await teacherModel.find(
      {
        $or: [
          { nationalCode: { $in: [...seenNationalCodes] } },
          { phone: { $in: [...seenPhones] } },
          { personnelCode: { $in: [...seenPersonnelCodes] } }
        ]
      },
      {
        nationalCode: 1,
        phone: 1,
        personnelCode: 1,
        _id: 0
      }
    ).lean();

    if (existingTeachers.length > 0) {
      const duplicates = existingTeachers.map(t => ({
        nationalCode: t.nationalCode,
        phone: t.phone,
        personnelCode: t.personnelCode
      }));

      return res.status(409).json({
        error: "معلم تکراری در سیستم وجود دارد",
        duplicates: duplicates,
        success: false
      });
    }

    const preparedTeachers = teachersData.map((t) => {
      const birthDay = t.birthDay ? new Date(t.birthDay) : null;

      return {
        firstName: String(t.firstName).trim(),
        lastName: String(t.lastName).trim(),
        phone: t.phone,
        nationalCode: t.nationalCode,
        personnelCode: t.personnelCode,
        birthDay: birthDay,
        gender: t.gender,
        school: manager.school,
        manager: manager._id,
        userName: t.nationalCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
    });

    const BATCH_SIZE = 100;
    let insertedCount = 0;
    const insertErrors = [];

    for (let i = 0; i < preparedTeachers.length; i += BATCH_SIZE) {
      const batch = preparedTeachers.slice(i, i + BATCH_SIZE);

      try {
        await teacherModel.insertMany(batch, {
          ordered: false,
          rawResult: false
        });
        insertedCount += batch.length;

        if (i + BATCH_SIZE < preparedTeachers.length) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        insertErrors.push({
          batch: Math.floor(i / BATCH_SIZE) + 1,
          error: error.message
        });
        console.error('Error in batch insert:', error);
      }
    }

    const response = {
      message: `${insertedCount} معلم از ${teachersData.length} مورد با موفقیت ایجاد شدند`,
      count: insertedCount,
      total: teachersData.length,
      success: true
    };

    if (insertErrors.length > 0) {
      response.warnings = {
        message: `برخی رکوردها با خطا مواجه شدند (${teachersData.length - insertedCount} مورد)`,
        count: insertErrors.length,
        details: insertErrors.slice(0, 3) // فقط ۳ خطای اول
      };
    }

    return res.status(201).json(response);

  } catch (error) {
    console.error('Error in GroupAdding:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "برخی معلمان تکراری هستند",
        success: false
      });
    }

    return res.status(500).json({
      error: "خطای سرور در پردازش درخواست",
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}