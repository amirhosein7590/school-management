import connectToDb from "@/utils/db";
import ownerModel from "@/models/owner";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";

export default async function (req, res) {
  if (req.method != "PUT") {
    return res
      .status(404)
      .json({ error: "این درخواست مجاز نیست", success: false });
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

    const { plan } = req.body;

    if (!plan || !plan.trim() || !["free", "subscription"].includes(plan)) {
      return res.status(422).json({ error: "فرمت یا فیلد نامعتبر است" });
    }

    const manager = await managerModel.findOne({ _id: req.query?.id });
    if (!manager) {
      return res.status(404).json({ error: "مدیر یافت نشد", success: false });
    }
    const expTime =
      plan == "free"
        ? Date.now() + Number(process.env.freePlanTime)
        : Date.now() + 31_536_000_000;
    manager.plan = plan;
    manager.expTime = expTime;
    await manager.save();

    return res.json({ message: "پلن با موفقیت تغییر یافت", success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
