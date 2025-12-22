import { isValidObjectId } from "mongoose";
import connectToDb from "@/utils/db";
import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";
import schoolModel from "@/models/school";
import RBAC from "@/utils/RBAC";

export default async function SetSchool(req, res) {
  if (req.method != "POST") {
    return res.status(400).json({ error: "خطای ناشناخته", success: false });
  }

  const auth = RBAC(req, res, ["owner"], {
    status: true,
    errorMessage: "مدیر یافت نشد",
  });

  if (!auth) return;
  const { nationalCode } = auth;

  const { schoolId } = req.body;

  if (!schoolId || !isValidObjectId(schoolId)) {
    return res.status(422).json({ error: "مدرسه یافت نشد", success: false });
  }

  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    const manager = await managerModel.findOne({ _id: req.query?.id });
    if (!manager) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }
    const school = await schoolModel.findOne({ _id: schoolId });
    if (!school) {
      return res.status(404).json({ error: "مدرسه یافت نشد", success: false });
    }

    manager.school = schoolId;
    await manager.save();

    return res.json({ message: "عملیات موفقیت آمیز بود", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
