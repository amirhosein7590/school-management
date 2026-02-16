import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";
import suggestModel from "@/models/suggest";
import ownerModel from "@/models/owner";
import { connect } from "mongoose";
import { isValidObjectId } from "mongoose";

export default async function SingleSuggest(req, res) {
  const auth = RBAC(req, res, ["owner"], {
    status: true,
    errorMessage: "پیشنهاد / انتقاد یافت نشد",
  });

  if (!auth) return;
  const { nationalCode, role } = auth;

  const { id } = req.query;
  if (!id || !isValidObjectId(id)) {
    return res.status(422).json({ errro: "آیدی نامعتبر است", success: false });
  }

  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }
    const suggest = await suggestModel.findOne({});
    if (!suggest) {
      return res
        .status(404)
        .json({ error: "پیشنهاد / انتقاد یافت نشد", success: false });
    }

    switch (req.method) {
      case "DELETE": {
        await suggestModel.deleteOne({ _id: id });
        return res.json({
          message: "پیشنهاد / انتقاد با موفقیت حذف شد",
          success: true,
        });
      }
      default: {
        return res
          .status(500)
          .json({ error: "خطای ناشناخته", dbError: error, success: false });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "خطای ناشناخته", dbError: error, success: false });
  }
}
