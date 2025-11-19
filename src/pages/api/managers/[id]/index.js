import ownerModel from "@/models/owner";
import connectToDb from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/tokenConf";
import { isValidObjectId } from "mongoose";
import managerModel from "@/models/manager";
import findUserByProps from "../../../../../utils/findUserByProps";

export default async function SingleManager(req, res) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "لطفا وارد حساب کاربری خود شوید" });
  }

  if (!req.query?.id || !isValidObjectId(req.query?.id)) {
    return res.status(422).json({ error: "کاربر یافت نشد", success: false });
  }

  try {
    await connectToDb();
    const { nationalCode } = verifyToken(token);
    if (!nationalCode) {
      return res
        .status(403)
        .json({ error: "دسترسی شما معتبر نیست", success: false });
    }
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

        return res.json({ message: "مدیر با موفقیت حذف شد", success: true });
      }

      case "PUT":
        {
          const exceptedProps = [
            "firstName",
            "lastName",
            "nationalCode",
            "personnelCode",
            "phone",
          ];

          const isBodyPropsValid = exceptedProps.every(
            (prop) => req.body[prop] && req.body[prop].trim()
          );

          if (!isBodyPropsValid) {
            return res
              .status(422)
              .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
          }
        }
        const { nationalCode, phone, personnelCode } = req.body;
        const user = await findUserByProps({
          nationalCode,
          phone,
          personnelCode,
        });
        if (user) {
          return res
            .status(409)
            .json({ error: "شخصی با این مشخصات وجود دارد", success: false });
        }
        const manager = await managerModel.findOneAndUpdate(
          { _id: req.query?.id },
          { ...req.body }
        );
        if (!manager) {
          return res
            .status(404)
            .json({ error: "مدیر یافت نشد", success: false });
        }
        return res.json({
          message: "مدیر با موفقیت ویرایش شد",
          success: false,
        });

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
