import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import findUserByProps from "@/utils/findUserByProps";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";
import teacherAttendanceModel from "@/models/teacherAttendance";
import studentAttendanceModel from "@/models/studentAttendance";
import studentModel from "@/models/student";

export default async function SingleManager(req, res) {
  const auth = RBAC(req, res, ["owner"], {
    status: true,
    errorMessage: "مدیر یافت نشد",
  });

  if (!auth) return;
  const { nationalCode } = auth;
  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    switch (req.method) {
      case "GET": {
        const manager = await managerModel.findOne({ _id: req.query?.id });
        if (!manager) {
          return res
            .status(404)
            .json({ error: "مدیر یافت نشد", success: false });
        }
        return res.json({ manager, success: true });
      }

      case "DELETE": {
        const manager = await managerModel.findOneAndDelete({
          _id: req.query?.id,
        });
        if (!manager) {
          return res
            .status(404)
            .json({ error: "مدیر یافت نشد", success: false });
        }
        await teacherModel.deleteMany({ manager: req.query?.id });
        await studentModel.deleteMany({ manager: req.query?.id });
        await teacherAttendanceModel.deleteMany({ manager: req.query.id });
        await studentAttendanceModel.deleteMany({ school: manager.school });

        return res.json({ message: "مدیر با موفقیت حذف شد", success: true });
      }

      case "PUT": {
        const exceptedProps = [
          "firstName",
          "lastName",
          "nationalCode",
          "personnelCode",
          "phone",
          "gender",
          "birthDay",
        ];

        const isBodyPropsValid = exceptedProps.every((prop) =>
          typeof req.body[prop] == "string"
            ? req.body[prop?.trim()]
            : req.body[prop]?.length > 0,
        );

        if (!isBodyPropsValid) {
          return res
            .status(422)
            .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
        }

        // const { nationalCode, phone, personnelCode } = req.body;
        // const user = await findUserByProps({
        //   nationalCode,
        //   phone,
        //   personnelCode,
        // });
        // if (user) {
        //   return res
        //     .status(409)
        //     .json({ error: "شخصی با این مشخصات وجود دارد", success: false });
        // }

        const manager = await managerModel.findOneAndUpdate(
          { _id: req.query?.id },
          {
            ...req.body,
            gender: req.body.gender[0],
            birthDay: new Date(req.body.birthDay),
          },
        );
        if (!manager) {
          return res
            .status(404)
            .json({ error: "مدیر یافت نشد", success: false });
        }
        return res.json({
          message: "اطلاعات مدیر با موفقیت تغییر یافت",
          success: true,
        });
      }

      default: {
        return res
          .status(400)
          .json({ error: "این درخواست مجاز نیست", success: false });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", success: false, dbError: error });
  }
}
