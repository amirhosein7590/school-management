import connectToDb from "@/utils/db";
import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";

export default async function planRenewal(req, res) {
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
    const manager = await managerModel.findOne({ _id: req.query?.id });
    if (!manager || !manager?.expTime) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }
    if (manager.expTime > Date.now()) {
      return res
        .status(403)
        .json({ error: "پلن ایشان هنوز به پایان نرسیده است", success: false });
    }
    const cashePlanTime = Number(process.env.cashePlanTime);
    manager.expTime = manager.expTime + cashePlanTime;
    manager.plan = "subscription";
    await manager.save();
    return res.json({ message: "تمدید پلن با موفقیت انجام شد", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
