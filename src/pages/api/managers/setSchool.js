import { isValidObjectId } from "mongoose";
import connectToDb from "@/utils/db";
import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";
import schoolModel from "@/models/school";
import RBAC from "@/utils/RBAC";

export default async function SetSchool(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجازنیست", success: false });
  }

  const auth = RBAC(req, res, ["owner"], {
    status: false,
  });

  if (!auth) return;
  const { nationalCode } = auth;

  const { schoolId, managerId } = req.body;

  if (!schoolId || !isValidObjectId(schoolId?.[0])) {
    return res.status(422).json({ error: "مدرسه یافت نشد", success: false });
  }

  if (!managerId || !isValidObjectId(managerId?.[0])) {
    return res.status(422).json({ error: "مدیر یافت نشد", success: false });
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
    const manager = await managerModel.findOne({ _id: managerId?.[0] });
    if (!manager) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }
    const school = await schoolModel.findOne({ _id: schoolId?.[0] });
    if (!school) {
      return res.status(404).json({ error: "مدرسه یافت نشد", success: false });
    }

    const duplicate = await managerModel.findOne({ school: schoolId?.[0] });
    if (duplicate) {
      return res.status(409).json({ error: "این مدرسه متعلق به مدیر دیگری است", sucesss: false })
    }

    manager.school = schoolId?.[0];
    school.manager = managerId?.[0];
    await school.save();
    await manager.save();

    return res.json({ message: "عملیات موفقیت آمیز بود", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
