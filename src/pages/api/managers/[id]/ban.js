import connectToDb from "@/utils/db";
import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";

export default async function BanManager(req, res) {
  if (req.method != "POST") {
    return res.status(400).json({ error: "خطای ناشناخته", success: false });
  }
  const auth = RBAC(req, res, ["owner"], {
    status: true,
    errorMessage: "مدیر یافت نشد",
  });

  if (!auth) return;
  const { nationalCode } = auth;

  try {
    await connectToDb();
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }

    const { isBanned } = req.body;

    if (typeof isBanned != "boolean") {
      return res
        .status(422)
        .json({ error: "فرمت یا فیلد نامعتبر است", success: false });
    }

    const manager = await managerModel.findOne({ _id: req.query?.id });
    if (!manager) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }
    const message = manager.isBanned ? "مدیر رفع مسدودیت شد" : "مدیر مسدود شد";
    manager.isBanned = isBanned;
    await manager.save();

    return res.json({ message, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
