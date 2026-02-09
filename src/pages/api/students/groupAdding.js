import RBAC from "@/utils/RBAC";
import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import studentModel from "@/models/student";

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

    if (!manager.actionsPermissions?.createStudent) {
      return res.status(403).json({
        error: "این عملیات از سوی مدیر سیستم محدود شده است",
        success: false,
      });
    }

    const { students } = req.body;
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res
        .status(422)
        .json({ error: "فرمت یا مقدار فیلد نامعتبر است", success: false });
    }
    const exceptedProps = [
      "firstName",
      "lastName",
      "nationalCode",
      "parentPhone",
      "birthDay",
      "grade",
    ];

    const validationErrors = [];
    const studentsData = [];
    const seenNationalCodes = new Set();
    const seenParentPhones = new Set();

    for (const s of students) {
      const nationalCodeStr = String(s.nationalCode || '').trim();
      const parentPhoneStr = String(s.parentPhone || '').trim();
      const isValid = exceptedProps.every(key =>
        s[key] && String(s[key]).trim() !== ''
      );

      if (!isValid) {
        validationErrors.push(`دانش‌آموز با کد ${nationalCodeStr || 'ناشناخته'} فیلدهای ضروری ندارد`);
        continue;
      }
      if (seenNationalCodes.has(nationalCodeStr) || seenParentPhones.has(parentPhoneStr)) {
        validationErrors.push(`دانش‌آموز ${nationalCodeStr} تکراری است`);
        continue;
      }

      seenNationalCodes.add(nationalCodeStr);
      seenParentPhones.add(parentPhoneStr);

      studentsData.push({
        ...s,
        nationalCode: nationalCodeStr,
        parentPhone: parentPhoneStr
      });
    }

    if (validationErrors.length > 0) {
      return res.status(422).json({
        error: "خطا در اعتبارسنجی",
        details: validationErrors.slice(0, 5),
        success: false
      });
    }
    const existingStudents = await studentModel.find(
      {
        $or: [
          { nationalCode: { $in: [...seenNationalCodes] } },
          { parentPhone: { $in: [...seenParentPhones] } }
        ]
      },
      {
        nationalCode: 1,
        parentPhone: 1,
        _id: 0
      }
    ).lean();

    if (existingStudents.length > 0) {
      const duplicates = existingStudents.map(s => ({
        nationalCode: s.nationalCode,
        parentPhone: s.parentPhone
      }));

      return res.status(409).json({
        error: "دانش‌آموز تکراری در سیستم وجود دارد",
        duplicates: duplicates,
        success: false
      });
    }
    const preparedStudents = studentsData.map((s) => {
      const birthDay = s.birthDay ? new Date(s.birthDay) : null;

      return {
        firstName: String(s.firstName).trim(),
        lastName: String(s.lastName).trim(),
        nationalCode: s.nationalCode,
        parentPhone: s.parentPhone,
        birthDay: birthDay,
        grade: s.grade,
        school: manager.school,
        manager: manager._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
    });
    const BATCH_SIZE = 100;
    let insertedCount = 0;
    const insertErrors = [];

    for (let i = 0; i < preparedStudents.length; i += BATCH_SIZE) {
      const batch = preparedStudents.slice(i, i + BATCH_SIZE);

      try {
        await studentModel.insertMany(batch, {
          ordered: false,
          rawResult: false
        });
        insertedCount += batch.length;
        if (i + BATCH_SIZE < preparedStudents.length) {
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
      message: `${insertedCount} دانش‌آموز از ${studentsData.length} مورد با موفقیت ایجاد شدند`,
      count: insertedCount,
      total: studentsData.length,
      success: true
    };

    if (insertErrors.length > 0) {
      response.warnings = {
        message: `برخی رکوردها با خطا مواجه شدند (${studentsData.length - insertedCount} مورد)`,
        count: insertErrors.length,
        details: insertErrors.slice(0, 3)
      };
    }

    return res.status(201).json(response);

  } catch (error) {
    console.error('Error in GroupAdding (Students):', error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "برخی دانش‌آموزان تکراری هستند",
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