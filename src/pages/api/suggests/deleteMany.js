import connectToDb from "@/utils/db";
import suggestModel from "@/models/suggest";
import ownerModel from "@/models/owner";
import RBAC from "@/utils/RBAC";
import { isValidObjectId } from "mongoose";

export default async function DeleteManySuggests(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner"], { status: false });
  if (!auth) return;

  const { nationalCode } = auth;

  if (!req.body || !req.body.ids) {
    return res
      .status(422)
      .json({ error: "آیدی دانش آموزان الزامی است", success: false });
  }

  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res
      .status(422)
      .json({ error: "آیدی‌ها باید به صورت آرایه باشند", success: false });
  }

  if (ids.length === 0) {
    return res
      .status(422)
      .json({ error: "هیچ آیدی‌ای ارسال نشده است", success: false });
  }

  const isValidIds = ids.every((id) => isValidObjectId(id));
  if (!isValidIds) {
    return res
      .status(422)
      .json({ error: "یک یا چند آیدی معتبر نیست", success: false });
  }

  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({ errro: "دسترسی غیر مجاز", success: false });
    }
    const result = await suggestModel.deleteMany({ _id: { $in: ids } });
    return res.json({
      message: `${result.deletedCount} پیشنهاد / انتقاد با موفقیت حذف شدند`,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
