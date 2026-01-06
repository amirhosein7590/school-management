import classModel from "@/models/class";
import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function Classes(req, res) {
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
            const [classes, total] = await Promise.all([
              classModel
                .find()
                .skip(skip)
                .limit(limit)
                .populate("school", "name _id"),
              classModel.countDocuments(),
            ]);
            return res.json({
              classes,
              totalPages: Math.ceil(total / limit),
              currentPage: page,
              success: true,
            });
          }
          const classes = await classModel
            .find()
            .populate("school", "name _id");
          return res.json({ classes, success: true });
        } else if (role == "manager") {
          const manager = await managerModel.findOne({ nationalCode });
          if (!manager) {
            return res.status(403).json({
              error: "شما مجاز به انجام این عملیات نیستید",
              success: false,
            });
          }
          if (page) {
            const [classes, total] = await Promise.all([
              classModel
                .find({ school: manager.school })
                .skip(skip)
                .limit(limit)
                .populate("school", "name _id"),
              classModel.countDocuments({ school: manager.school }),
            ]);
            return res.json({
              classes,
              totalPages: Math.ceil(total / limit),
              currentPage: page,
              success: true,
            });
          }
          const classes = await classModel
            .find({ school: manager.school })
            .populate("school", "name _id");
          return res.json({ classes, success: true });
        }
      }

      case "POST": {
        const exceptedProps = ["name", "capacity", "grade"];
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
        if (!manager.actionsPermissions.createClass) {
          return res.status(403).json({
            error: "این عملیات از سوی مدیر سیستم محدود شده است",
            success: false,
          });
        }
        const cls = await classModel.findOne({
          name: req.body?.name,
          school: manager.school,
        });
        if (cls) {
          return res
            .status(409)
            .json({ error: "کلاسی با این مشخصات وجود دارد", success: false });
        }
        await classModel.create({
          ...req.body,
          grade: Number(req.body.grade),
          school: manager.school,
        });
        return res
          .status(201)
          .json({ message: "کلاس با موفقیت ایجاد شد", success: true });

        // owner role is not doing anything in this api (POST Request) but may be later must to add it
      }

      default: {
        return res
          .status(405)
          .json({ error: "این درخواست مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
