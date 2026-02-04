import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import schoolModel from "@/models/school";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function SearchTeacher(req, res) {
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
    const exceptedProps = ["name", "level", "shift", "gender"];

    if (Object.keys(req.body).length < 1) {
      const schools = await schoolModel
        .find({})
        .populate("manager", "firstName lastName _id");

      return res.json({ message: "موفق", schools, success: true });
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
      query.gender = req.body.gender?.[0];
    }

    if (req.body?.name) {
      query.name = { $regex: req.body?.name, $options: "i" };
    }

    if (req.body?.level) {
      query.level = req.body?.level?.[0];
    }

    if (req.body?.shift) {
      query.shift = req.body?.shift?.[0];
    }

    const schools = await schoolModel
      .find(query)
      .populate("manager", "firstName lastName _id");
    return res.json({ message: "موفق", schools, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
