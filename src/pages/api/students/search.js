import managerModel from "@/models/manager";
import connectToDb from "@/utils/db";
import studentModel from "@/models/student";
import RBAC from "@/utils/RBAC";

// export default async function SearchStudent(req, res) {
//   if (req.method != "POST") {
//     return res
//       .status(405)
//       .json({ error: "این درخواست مجاز نیست", success: false });
//   }
//   const auth = RBAC(req, res, ["owner", "manager"], { status: false });

//   if (!auth) return;
//   const { nationalCode, role } = auth;
//   try {
//     await connectToDb();
//     if (role == "manager") {
//       const manager = await managerModel.findOne({ nationalCode });
//       if (!manager) {
//         return res
//           .status(403)
//           .json({ error: "دسترسی غیر مجاز", success: false });
//       }
//       const students = await studentModel.find({
//         $or: [
//           { firstName: { $regex: req.body.value, $options: "i" } },
//           { lastName: { $regex: req.body.value, $options: "i" } },
//           { parentPhone: { $regex: req.body.value, $options: "i" } },
//         ],
//         school: manager.school,
//       });
//       return res.json({ students, success: true });
//     } else {
//       // owner
//     }
//   } catch (error) {
//     return res.status(500).json({ error: "خطای ناشناخته", success: false });
//   }
// }

// last version

export default async function SearchTeacher(req, res) {
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
    const manager = await managerModel.findOne({ nationalCode });
    if (!manager) {
      return res.status(403).json({ error: "دسترسی غیر مجاز", success: false });
    }
    const exceptedProps = [
      "firstName",
      "lastName",
      "parentPhone",
      "nationalCode",
      "birthDay",
      "class",
    ];

    if (Object.keys(req.body).length < 1) {
      const students = await studentModel
        .find(
          {
            manager: manager._id,
            school: manager.school,
          },
          "-actionsPermissions -userName -password"
        )
        .populate("class", "name _id");

      return res.json({ message: "موفق", students, success: true });
    }

    const isBodyPropsValid = Object.keys(req.body).every((prop) =>
      exceptedProps.includes(prop)
    );
    if (!isBodyPropsValid) {
      return res
        .status(422)
        .json({ error: "مقادیر سرچ نامعتبر است", success: false });
    }
    const query = { ...req.body, school: manager.school, manager: manager._id };

    if (req.body.class) {
      query.class = req.body.class[0];
    }

    if (req.body.firstName) {
      query.firstName = { $regex: req.body.firstName, $options: "i" };
    }

    if (req.body.lastName) {
      query.lastName = { $regex: req.body.lastName, $options: "i" };
    }

    const students = await studentModel
      .find(query, "-actionsPermissions -userName -password")
      .populate("class", "name _id");
    return res.json({ message: "موفق", students, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
