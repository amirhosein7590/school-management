import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";

async function Managers(req, res) {
  const auth = RBAC(req, res, ["owner"]);

  if (!auth) return;
  const { nationalCode } = auth;

  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(422).json({ error: "دسترسی غیر مجاز", success: false });
    }

    switch (req.method) {
      case "GET": {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (page) {
          const [managers, total] = await Promise.all([
            managerModel
              .find()
              .skip(skip)
              .limit(limit)
              .populate("school", "name _id"),
            managerModel.countDocuments(),
          ]);
          return res.json({
            managers,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        } else {
          const managers = await managerModel
            .find()
            .populate("school", "name _id");
          return res.json({ managers, success: true });
        }
      }
      case "POST": {
        const exceptedProps = [
          "firstName",
          "lastName",
          "nationalCode",
          "personnelCode",
          "phone",
          "gender",
        ];

        const isBodyPropsValid = exceptedProps.every((prop) => req.body[prop]);
        if (!isBodyPropsValid) {
          return res
            .status(422)
            .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
        }

        const user = await managerModel.findOne({
          $or: [
            { nationalCode: req.body?.nationalCode },
            { personnelCode: req.body?.personnelCode },
            { phone: req.body?.phone },
          ],
        });

        if (user) {
          return res
            .status(409)
            .json({ error: "شخصی با این مشخصات وجود دارد", success: false });
        }

        await managerModel.create({
          ...req.body,
          isBanned: false,
          role: "manager",
          notifications: [
            {
              text: "مدیر محترم ، ثبت نام شما در سامانه مداد با موفقیت انجام شد \n به جمع مدیران پیش رو و نوآور خوش آمدید \n در صورت نیاز به راهنمایی \n شماره تماس : 09375117590",
              status: "success",
            },
          ],
        });

        return res
          .status(201)
          .json({ message: "مدیر با موفقیت ایجاد شد", success: true });
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

export default Managers;
