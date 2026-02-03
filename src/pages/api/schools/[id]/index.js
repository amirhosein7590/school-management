import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import schoolModel from "@/models/school";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function SingleSchool(req, res) {
  try {
    const auth = RBAC(req, res, ["owner", "manager"], {
      status: true,
      errorMessage: "مدرسه یافت نشد",
    });

    if (!auth) return;
    const { nationalCode, role } = auth;

    const models = {
      owner: ownerModel,
      manager: managerModel,
    };

    await connectToDb();

    switch (req.method) {
      case "GET": {
        const user = await models[role].findOne({ nationalCode });
        if (!user) {
          return res.status(422).json({
            error: "شما مجاز به انجام این عملیات نیستید",
            success: false,
          });
        }

        const query = { _id: req.query?.id };
        if (user.role == "manager") {
          query.manager = String(user._id);
        }

        const school = await schoolModel.findOne(query);
        if (!school) {
          return res
            .status(404)
            .json({ error: "مدرسه یافت نشد", success: false });
        }
        return res.json({ school, success: true });
      }
      case "DELETE": {
        if (role != "owner") {
          return res.status(403).json({
            error: "شما مجاز به انجام این عملیات نیستید",
            success: false,
          });
        }
        const owner = await ownerModel.findOne({ nationalCode });
        if (!owner) {
          return res.status(403).json({
            error: "شما مجاز به انجام این عملیات نیستید",
            success: false,
          });
        }
        const school = await schoolModel.findOneAndDelete({
          _id: req.query?.id,
        });
        if (!school) {
          return res
            .status(404)
            .json({ error: "مدرسه یافت نشد", success: false });
        }

        return res.json({ message: "مدرسه با موفقیت حذف شد", success: true });
      }
      case "PUT": {
        const exceptedProps = [
          "name",
          "address",
          "level",
          "shift",
          "phone",
          "gender",
        ];
        const isBodyPropsValid = exceptedProps.every((prop) => req.body[prop]);
        if (!isBodyPropsValid) {
          return res
            .status(422)
            .json({ error: "فرمت یا مقدار فیلد نادرست است", success: false });
        }

        if (isNaN(Number(req.body.level))) {
          return res
            .status(22)
            .json({ error: "دوره مدرسه نا معتبر است", success: false });
        }

        if (role == "owner") {
          const owner = await ownerModel.findOne({ nationalCode });
          if (!owner) {
            return res.status(403).json({
              error: "شما مجاز به انجام این عملیات نیستید",
              success: false,
            });
          }
          const school = await schoolModel.findOneAndUpdate(
            { _id: req.query?.id },
            {
              ...req.body,
              gender: req.body?.gender?.[0],
              shift: req.body?.shift?.[0],
              level: req.body?.level?.[0],
            },
          );

          if (!school) {
            return res
              .status(404)
              .json({ error: "مدرسه یافت نشد", success: false });
          }

          return res.json({
            message: "اطلاعات مدرسه با موفقیت تغییر یافت",
            success: true,
          });
        } else if (role == "manager") {
          const manager = await managerModel.findOne({ nationalCode });
          if (!manager) {
            return res.status(403).json({
              error: "شما مجاز به انجام این عملیات نیستید",
              success: false,
            });
          }
          if (!manager.actionsPermissions.overrideSchoolSettings) {
            return res.status(403).json({
              error: "این عملیات از سوی مدیر سیستم محدود شده است",
              success: false,
            });
          }
          if (manager.school != req.query?.id) {
            return res.status(403).json({
              error: "شما مجاز به تغییر مدرسه خود هستید",
              success: false,
            });
          }
          const school = await schoolModel.findOneAndUpdate(
            {
              _id: req.query.id,
              manager: manager._id,
            },
            {
              ...req.body,
              shift: req.body.shift[0],
              level: Number(req.body.level[0]),
              gender: req.body.gender[0],
            },
          );
          if (!school) {
            return res
              .status(404)
              .json({ error: "مدرسه یافت نشد", success: false });
          }

          return res.json({
            message: "اطلاعات مدرسه با موفقیت تغییر یافت",
            success: true,
          });
        }
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
