import classModel from "@/models/class";
import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import studentModel from "@/models/student";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function Students(req, res) {
  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: false,
  });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();

    switch (req.method) {
      case "GET": {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit) || 45;
        const skip = (page - 1) * limit;
        const query = {};
        if (role == "manager") {
          const manager = await managerModel.findOne({ nationalCode });
          if (!manager) {
            return res.status(403).json({ error: "", success: false });
          }
          query.manager = manager._id;
          query.school = manager.school;
        } else if (role == "teacher") {
          const teacher = await teacherModel.findOne({ nationalCode });
          if (!teacher) {
            return res
              .status(403)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }
          if (!teacher?.class) {
            return res
              .status(403)
              .json({ error: "برای شما کلاسی تعریف نشده", success: false });
          }
          query.school = teacher.school;
          query.manager = teacher.manager;
          query.teacher = teacher._id;
          query.class = teacher.class;
        } else {
          const owner = await ownerModel.findOne({ nationalCode });
          if (!owner) {
            return res
              .status(403)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }
        }
        if (page) {
          const [students, total] = await Promise.all([
            studentModel
              .find(query)
              .skip(skip)
              .limit(limit)
              .populate("school", "name _id")
              .populate("manager", "firstName lastName _id ")
              .populate("teacher", "firstName lastName _id")
              .populate("class", "name _id"),
            studentModel.countDocuments(),
          ]);
          return res.json({
            students,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        }
        const students = await studentModel
          .find(query, "-actionsPermissions -userName -password")
          .populate("teacher", "firstName lastName _id")
          .populate("school", "name _id")
          .populate("manager", "firstName lastName _id ")
          .populate("class", "name _id");
        return res.json({ students, success: true });
      }

      case "POST": {
        const exceptedProps = [
          "firstName",
          "lastName",
          "nationalCode",
          "parentPhone",
          "birthDay",
          "grade",
        ];
        const isBodyPropsValid = exceptedProps.every((prop) => req.body[prop]);
        if (!isBodyPropsValid) {
          return res.status(422).json({
            error: "فرمت یا مقدار فیلد نامعتبر نیست",
            success: false,
          });
        }
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
        const student = await studentModel.findOne({
          nationalCode: req.body?.nationalCode,
          parentPhone: req.body?.parentPhone,
        });
        if (student) {
          return res.status(409).json({
            error: "دانش آموزی با این مشخصات وجود دارد",
            success: false,
          });
        }

        if (req.body?.class?.[0]) {
          const cls = await classModel.findOne({ _id: req.body.class[0] });
          if (!cls) {
            return res
              .status(404)
              .json({ error: "کلاس یافت نشد", success: false });
          }
          if (!cls.teacher) {
            return res.status(403).json({
              error: "نخست باید کلاس بندی معلم انجام شود",
              success: false,
            });
          }
          if (cls.capacity < 1) {
            return res
              .status(403)
              .json({ error: "کلاس ظرفیت ندارد", success: false });
          }
          const newStudent = await studentModel.create({
            ...req.body,
            grade: Number(req.body.grade?.[0]),
            manager: manager._id,
            school: manager.school,
          });
          cls.capacity = cls.capacity - 1;
          await cls.save();
          newStudent.teacher = cls.teacher;
          newStudent.class = cls._id;
          await newStudent.save();
        } else {
          const { class: Class, ...body } = req.body;
          await studentModel.create({
            ...body,
            grade: Number(req.body.grade?.[0]),
            manager: manager._id,
            school: manager.school,
          });
        }

        return res
          .status(201)
          .json({ message: "دانش آموز با موفقیت ایجاد شد", success: true });
      }

      default: {
        return res
          .status(400)
          .json({ error: "این درخواست مجاز نیست", success: false });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", success: false, dbError: error });
  }
}
