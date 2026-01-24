import connectToDb from "@/utils/db";
import schoolModel from "@/models/school";
import RBAC from "@/utils/RBAC";

export default async function classesQuantity(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = RBAC(req, res, ["owner"], { status: false });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    const school = await schoolModel.findOne({ nationalCode });
    if (!school) {
      return res.status(403).json({
        error: "شما مجاز به انجام این عملیات نیستید",
        success: false,
      });
    }
    const schools = await schoolModel.countDocuments();

    return res.json({ message: `${schools} مدرسه`, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
