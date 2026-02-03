import connectToDb from "@/utils/db";
import schoolModel from "@/models/school";
import RBAC from "@/utils/RBAC";
import ownerModel from "@/models/owner";

export default async function deleteManySchools(req, res) {
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
    const owner = await ownerModel.findOne({ nationalCode });
    if (!owner) {
      return res
        .status(403)
        .json({ error: "شما مجاز به انجام این عملیات نیستید", success: false });
    }
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(422)
        .json({ error: "اطلاعات مدرسه ها نامعتبر است", success: false });
    }
    const schools = await schoolModel.deleteMany({ _id: { $in: ids } });
    console.log(schools);
    return res.json({
      message: `${schools.deletedCount} مدرسه با موفقیت حذف شدند`,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
