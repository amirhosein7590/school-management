import ownerModel from "@/models/owner";
import schoolModel from "@/models/school";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function Schools(req, res) {
  const auth = RBAC(req, res, ["owner"], { status: false });
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
          const [schools, total] = await Promise.all([
            schoolModel
              .find()
              .skip(skip)
              .limit(limit)
              .populate("manager", "firstName lastName _id"),
            schoolModel.countDocuments(),
          ]);
          return res.json({
            schools,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        } else {
          const schools = await schoolModel
            .find()
            .populate("manager", "firstName lastName _id");
          return res.json({ schools, success: true });
        }
      }

      case "POST": {
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
            .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
        }

        if (isNaN(Number(req.body.level))) {
          return res
            .status(22)
            .json({ error: "دوره مدرسه نا معتبر است", success: false });
        }

        const school = await schoolModel.findOne({ phone: req.body.phone });
        if (school) {
          return res.status(409).json({
            error: "مدرسه ای با این مشخصات وجود دارد",
            success: false,
          });
        }
        await schoolModel.create({
          ...req.body,
          shift: req.body.shift[0],
          level: Number(req.body.level[0]),
          gender: req.body.gender[0],
        });
        return res.json({ message: "مدرسه با موفقیت ایجاد شد", success: true });
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
