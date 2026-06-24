import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import teacherAttendanceModel from "@/models/teacherAttendance";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function SingleTeacher(req, res) {
  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "معلم یافت نشد",
  });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    switch (req.method) {
      case "GET": {
        if (role == "owner") {
          const { teacher } = await checkRoleAndTeacher(
            req,
            nationalCode,
            res,
            "owner",
          );
          if (!teacher) {
            return res
              .status(404)
              .json({ error: "معلم یافت نشد", success: false });
          }
          return res.json({ teacher, success: true });
        } else if (role == "manager") {
          const { teacher } = await checkRoleAndTeacher(
            req,
            nationalCode,
            res,
            "manager",
          );
          return res.json({ teacher, success: true });
        }
      }

      case "PUT": {
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
        const { permissions, managerId, schoolId } = await checkRoleAndTeacher(
          req,
          nationalCode,
          res,
          "manager",
        );

        if (!permissions.editTeacher) {
          return res.status(403).json({
            error: "این عملیات از سوی مدیر سیستم محدود شده است",
            success: false,
          });
        }

        await teacherModel.findOneAndUpdate(
          {
            _id: req.query?.id,
            school: schoolId,
            manager: managerId,
          },
          { ...req.body, gender: req.body.gender[0] },
        );

        // const isPhoneDuplicate = 

        return res.json({
          message: "اطلاعات معلم با موفقیت تغییر یافت",
          success: true,
        });
      }

      case "DELETE": {
        const { schoolId, managerId, permissions } = await checkRoleAndTeacher(
          req,
          nationalCode,
          res,
          "manager",
        );
        if (!permissions.deleteTeacher) {
          return res.status(403).json({
            error: "این عملیات از سوی مدیر سیستم محدود شده است",
            success: false,
          });
        }
        await teacherModel.findOneAndDelete({
          school: schoolId,
          manager: managerId,
          _id: req.query?.id,
        });

        await teacherAttendanceModel.deleteMany({
          teacher: req.query.id,
          manager: managerId,
        });

        return res.json({ message: "معلم با موفقیت حذف شد", success: true });
      }

      default: {
        return res
          .status(400)
          .json({ error: "این درخواست مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته",details : String(error), success: false });
  }
}

async function checkRoleAndTeacher(req, nationalCode, res, role) {
  const Model = role == "owner" ? ownerModel : managerModel;
  const model = await Model.findOne({ nationalCode });
  if (!model) {
    return res.status(403).json({
      error: "شما مجاز به انجام این عملیات نیستید",
      success: false,
    });
  }
  const teacher =
    role == "manager"
      ? await teacherModel
          .findOne(
            {
              _id: req.query?.id,
              manager: model._id,
              school: model.school,
            },
            "-actionsPermissions -password -userName",
          )
          .populate("school", "name _id")
          .populate("class", "name _id")
      : teacherModel
          .findOne(
            { _id: req.query?.id },
            "-actionsPermissions -password -userName",
          )
          .populate("school", "name _id")
          .populate("manager", "firstName lastName _id")
          .populate("class", "name _id");
  if (!teacher) {
    return res.status(404).json({ error: "معلم یافت نشد", success: false });
  }

  if (role == "manager") {
    return {
      teacher,
      schoolId: model.school,
      managerId: model._id,
      permissions: model.actionsPermissions,
    };
  }
  return { teacher };
}
