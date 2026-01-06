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
    const manager = await managerModel.findOne({ nationalCode });
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
    for (const s of students) {
      const isValid = exceptedProps.every((key) => s[key]);
      if (!isValid) {
        return res
          .status(422)
          .json({ error: "فیلد یا مقدار نامعتبر است", success: false });
      }
    }
    const nationalCodes = students.map((s) => s.nationalCode);
    const parentPhones = students.map((s) => s.parentPhone);
    const duplicates = await studentModel.find({
      $or: [
        { nationalCode: { $in: nationalCodes } },
        { parentPhone: { $in: parentPhones } },
      ],
    });
    if (duplicates.length > 0) {
      return res.status(409).json({
        error: "دانش آموز تکراری وجود دارد",
        success: false,
      });
    }

    const preparedStudents = await Promise.all(
      students.map(async (s) => ({
        ...s,
        school: manager.school,
        manager: manager._id,
      }))
    );
    await studentModel.insertMany(preparedStudents, {
      ordered: false,
    });

    return res.status(201).json({
      message: "دانش آموزان با موفقیت ایجاد شدند",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}
