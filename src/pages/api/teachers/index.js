import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function Teachers(req, res) {
  const auth = RBAC(req, res, ["owner", "manager"], { status: false });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();

    switch (req.method) {
      case "GET": {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (role == "owner") {
          const owner = await ownerModel.findOne({ nationalCode });
          if (!owner) {
            return res.status(403).json({
              error: "شما مجاز به انجام این عملیات نیستید",
              success: false,
            });
          }
          if (page) {
            const [teachers, total] = await Promise.all([
              teacherModel
                .find({}, "-actionsPermissions -userName -password")
                .skip(skip)
                .limit(limit)
                .populate("school", "name _id")
                .populate("manager", "firstName lastName _id ")
                .populate("class", "name _id"),
              teacherModel.countDocuments(),
            ]);
            return res.json({
              teachers,
              totalPages: Math.ceil(total / limit),
              currentPage: page,
              success: true,
            });
          }
          const teachers = await teacherModel
            .find({}, "-actionsPermissions -userName -password")
            .populate("school", "name _id")
            .populate("manager", "firstName lastName _id ")
            .populate("class", "name _id");
          return res.json({ teachers, success: true });
        } else if (role == "manager") {
          const manager = await managerModel.findOne({ nationalCode });
          if (!manager) {
            return res.status(403).json({
              error: "شما مجاز به انجام این عملیات نیستید",
              success: false,
            });
          }
          if (page) {
            const [teachers, total] = await Promise.all([
              teacherModel
                .find(
                  { school: manager.school, manager: manager._id },
                  "-actionsPermissions -userName -password"
                )
                .skip(skip)
                .limit(limit)
                .populate("school", "name _id")
                .populate("class", "name _id"),
              teacherModel.countDocuments({
                school: manager.school,
                manager: manager._id,
              }),
            ]);
            return res.json({
              teachers,
              totalPages: Math.ceil(total / limit),
              currentPage: page,
              success: true,
            });
          }
          const teachers = await teacherModel
            .find(
              {
                school: manager.school,
                manager: manager._id,
              },
              "-actionsPermissions -userName -password"
            )
            .populate("school", "name _id")
            .populate("class", "name _id");

          return res.json({ teachers, success: true });
        }
      }

      case "POST": {
        const exceptedProps = [
          "firstName",
          "lastName",
          "phone",
          "nationalCode",
          "personnelCode",
          "birthDay",
          "gender",
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
        if (!manager.actionsPermissions?.createTeacher) {
          return res.status(403).json({
            error: "این عملیات از سوی مدیر سیستم محدود شده است",
            success: false,
          });
        }
        const teacher = await teacherModel.findOne({
          $or: [
            { nationalCode: req.body?.nationalCode },
            { personnelCode: req.body?.personnelCode },
            { phone: req.body?.phone },
          ],
        });
        if (teacher) {
          return res
            .status(409)
            .json({ error: "معلمی با این مشخصات وجود دارد", success: false });
        }
        await teacherModel.create({
          ...req.body,
          school: manager.school,
          manager: manager._id,
          gender: req.body.gender[0],
        });

        return res
          .status(201)
          .json({ message: "معلم با موفقیت ایجاد شد", success: true });
      }
      default: {
        return res
          .status(400)
          .json({ error: "این درخواست مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
