import classModel from "@/models/class";
import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import studentAttendanceModel from "@/models/studentAttendance";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function SingleClass(req, res) {
  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "کلاس یافت نشد",
  });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    switch (req.method) {
      case "GET": {
        if (role == "owner") {
          const owner = await ownerModel.findOne({ nationalCode });
          if (!owner) {
            return res
              .status(403)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }
          const Class = await classModel.findOne({ _id: req.query?.id });
          if (!Class) {
            return res
              .status(404)
              .json({ error: "کلاس یافت نشد", success: false });
          }
          return res.json({ class: Class, success: true });
        }
        const { Class } = await CheckManagerAndSchool(
          req.query?.id,
          res,
          nationalCode,
        );
        return res.json({ class: Class, success: true });
      }
      case "PUT": {
        if (role == "manager") {
          const { manager } = await CheckManagerAndSchool(
            req.query?.id,
            res,
            nationalCode,
          );

          if (!manager) {
            return res
              .status(403)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }

          if (!manager?.actionsPermissions?.editClass) {
            return res.status(403).json({
              error: "این عملیات از سوی مدیر سیستم محدود شده است",
              success: false,
            });
          }

          const exceptedProps = ["name", "capacity", "grade"];
          const isBodyPropsValid = exceptedProps.every(
            (prop) => req.body[prop],
          );
          if (!isBodyPropsValid) {
            return res
              .status(422)
              .json({ error: "فرمت یا فیلد نامعتبر است", success: false });
          }
          const cls = await classModel.findOneAndUpdate(
            {
              _id: req.query.id,
              school: manager.school,
            },
            {
              ...req.body,
              grade: Number(req.body.grade),
              school: manager.school,
            },
          );
          if (!cls) {
            return res
              .status(404)
              .json({ error: "کلاس یافت نشد", success: false });
          }
          return res.json({
            message: "اطلاعات کلاس با موفقیت تغییر کرد",
            success: true,
          });
        }

        // owner role is not doing anything in this api (POST Request) but may be later must to add it
      }
      case "DELETE": {
        if (role == "manager") {
          const { manager } = await CheckManagerAndSchool(
            req.query?.id,
            res,
            nationalCode,
          );
          if (!manager.actionsPermissions.deleteClass) {
            return res.status(403).json({
              error: "این عملیات از سوی مدیر سیستم محدود شده است",
              success: false,
            });
          }
          const cls = await classModel.findOneAndDelete({
            _id: req.query?.id,
            school: manager.school,
          });

          await studentAttendanceModel.deleteMany({
            class: req.query.id,
            school: manager.school,
          });

          if (!cls) {
            return res
              .status(404)
              .json({ error: "کلاس یافت نشد", success: false });
          }
          return res.json({ message: "کلاس با موفقیت حذف شد", success: true });
        }
        // owner role is not doing anything in this api (POST Request) but may be later must to add it
      }
    }
  } catch (error) {
    res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}

async function CheckManagerAndSchool(classId, res, nationalCode) {
  const manager = await managerModel.findOne({ nationalCode });
  if (!manager) {
    return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
  }
  const Class = await classModel.findOne({
    _id: classId,
    school: manager.school,
  });
  if (!Class) {
    return res.status(404).json({ error: "کلاس یافت نشد", success: false });
  }

  return { Class, manager };
}
