import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import RBAC from "@/utils/RBAC";

export default async function SearchManagers(req, res) {
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
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }
    const exceptedProps = [
      "firstName",
      "lastName",
      "phone",
      "nationalCode",
      "personnelCode",
      "birthDay",
      "gender",
    ];

    if (Object.keys(req.body).length < 1) {
      const managers = await managerModel.find(
        {},
        "-actionsPermissions -userName -password",
      );
      return res.json({ message: "موفق", managers, success: true });
    }

    const isBodyPropsValid = Object.keys(req.body).every((prop) =>
      exceptedProps.includes(prop),
    );
    if (!isBodyPropsValid) {
      return res
        .status(422)
        .json({ error: "مقادیر سرچ نامعتبر است", success: false });
    }
    const query = { ...req.body };

    if (req.body?.gender) {
      query.gender = req.body.gender[0];
    }

    if (req.body.firstName) {
      query.firstName = { $regex: req.body.firstName, $options: "i" };
    }

    if (req.body.lastName) {
      query.lastName = { $regex: req.body.lastName, $options: "i" };
    }

    const managers = await managerModel.find(
      query,
      "-actionsPermissions -userName -password",
    );
    return res.json({ message: "موفق", managers, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
