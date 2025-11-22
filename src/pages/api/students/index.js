import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import studentModel from "@/models/student";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function Students(req, res) {
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
            const [students, total] = await Promise.all([
              studentModel
                .find({}, "-actionsPermissions -userName -password")
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
            .find({}, "-actionsPermissions -userName -password")
            .populate("school", "name _id")
            .populate("teacher", "firstName lastName _id")
            .populate("manager", "firstName lastName _id ")
            .populate("class", "name _id");
          return res.json({ students, success: true });
        } else if (role == "manager") {
          const manager = await managerModel.findOne({ nationalCode });
          if (!manager) {
            return res.status(403).json({
              error: "شما مجاز به انجام این عملیات نیستید",
              success: false,
            });
          }
          if (page) {
            const [students, total] = await Promise.all([
              studentModel
                .find(
                  { school: manager.school, manager: manager._id },
                  "-manager -school"
                )
                .skip(skip)
                .limit(limit)
                .populate("teacher", "firstName lastName _id")
                .populate("class", "name _id"),
              studentModel.countDocuments({
                school: manager.school,
                manager: manager._id,
              }),
            ]);
            return res.json({
              students,
              totalPages: Math.ceil(total / limit),
              currentPage: page,
              success: true,
            });
          }
          const students = await studentModel
            .find(
              {
                school: manager.school,
                manager: manager._id,
              },
              "-manager -school"
            )
            .populate("school", "name _id")
            .populate("class", "name _id");

          return res.json({ students, success: true });
        }
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
            error: "این عملیات از سوی مالک محدود شده است",
            success: false,
          });
        }
        const student = await studentModel.findOne({
          $or: [
            { nationalCode: req.body?.nationalCode },
            { parentPhone: req.body?.parentPhone },
          ],
        });
        if (student) {
          return res.status(409).json({
            error: "دانش آموزی با این مشخصات وجود دارد",
            success: false,
          });
        }
        await studentModel.create({
          ...req.body,
          manager: manager._id,
          school: manager.school,
        });
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
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
