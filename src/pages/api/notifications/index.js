import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";
import teacherModel from "@/models/teacher";

export default async function Notifications(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const ALLOWED_STATUS = ["error", "warning", "success", "info"];
  const { text, status } = req.body;
  if (!text?.trim() || !ALLOWED_STATUS.includes(status)) {
    return res
      .status(422)
      .json({ error: "متن یا وضعیت اعلان نامعتبر است", success: false });
  }
  const auth = RBAC(req, res, ["owner"]);

  if (!auth) return;
  const { nationalCode } = auth;

  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }
    await managerModel.updateMany(
      {},
      {
        $push: {
          notifications: {
            $each: [{ text, status }],
            $slice: -50,
          },
        },
      }
    );
    await teacherModel.updateMany(
      {},
      {
        $push: {
          notifications: {
            $each: [{ text, status }],
            $slice: -50,
          },
        },
      }
    );
    return res.json({ message: "اعلان با موفقیت ارسال شد", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
