import classModel from "@/models/class";
import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function SearchClass(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }
  const auth = RBAC(req, res, ["owner", "manager"], { status: false });

  if (!auth) return;
  const { nationalCode, role } = auth;
  try {
    await connectToDb();
    if (role == "manager") {
      const manager = await managerModel.findOne({ nationalCode });
      if (!manager) {
        return res
          .status(403)
          .json({ error: "دسترسی غیر مجاز", success: false });
      }

      const exceptedProps = ["name", "grade"];
      if (Object.keys(req.body).length < 1) {
        const classes = await classModel
          .find({ school: manager.school })
          .populate("teacher", "_id firstName lastName");
        return res.json({ message: "موفق", classes, success: true });
      }

      const isBodyPropsValid = Object.keys(req.body).every((prop) =>
        exceptedProps.includes(prop),
      );
      if (!isBodyPropsValid) {
        return res
          .status(422)
          .json({ error: "مقادیر سرچ نامعتبر است", success: false });
      }

      const query = { ...req.body, school: manager.school };

      if (req.body.name) {
        query.name = { $regex: req.body.name, $options: "i" };
      }

      if (req.body.grade) {
        query.grade = Number(req.body.grade[0]);
      }

      const classes = await classModel
        .find(query)
        .populate("teacher", "_id firstName lastName");

      return res.json({ classes, success: true });
    } else {
      // owner
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
