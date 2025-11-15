import ownerModel from "@/models/owner";
import connectToDb from "../../../../utils/db";
import { verifyToken } from "../../../../utils/tokenConf";
import managerModel from "@/models/manager";

async function Manager(req, res) {
  try {
    await connectToDb();
    const { nationalCode, role } = verifyToken(req.cookies?.token);
    const owner = await ownerModel.findOne({ nationalCode });

    if (!nationalCode || !role) {
      return res.status(422).json({ error: "دسترسی غیر مجاز", success: false });
    }

    if (role != "owner" || !owner) {
      return res.status(422).json({ error: "دسترسی غیر مجاز", success: false });
    }

    switch (req.method) {
      case "GET": {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (page) {
          const [managers, total] = await Promise.all([
            managerModel.find().skip(skip).limit(limit),
            managerModel.countDocuments(),
          ]);
          return res.json({
            managers,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            success: true,
          });
        } else {
          const managers = await managerModel.find();
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
          "expTime",
        ];

        const isBodyPropsValid = exceptedProps.every(
          (prop) =>
            req.body[prop.trim()] != null && req.body[prop.trim()] != undefined
        );
        if (!isBodyPropsValid) {
          return res
            .status(422)
            .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
        }

        const manager = await managerModel.findOne({
          nationalCode: req.body?.nationalCode,
          role: "manager",
        });

        if (manager) {
          return res
            .status(409)
            .json({ error: "مدیری با این مشخصات وجود دارد", success: false });
        }

        await managerModel.create({
          ...req.body,
          isBanned: false,
          role: "manager",
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

export default Manager;
