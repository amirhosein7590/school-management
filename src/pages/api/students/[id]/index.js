import managerModel from "@/models/manager";
import studentModel from "@/models/student";
import connectToDb from "@/utils/db";
import RBAC from "@/utils/RBAC";

export default async function SingleStudent(req, res) {
  const auth = RBAC(req, res, ["owner", "manager"], {
    status: true,
    errorMessage: "دانش آموز یافت نشد",
  });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    switch (req.method) {
      case "GET": {
        const manager = await managerModel.findOne({ nationalCode });
        if (!manager) {
          return res
            .status(403)
            .json({ error: "دسترسی غیر مجاز", success: false });
        }

        const student = await studentModel.findOne({
          _id: req.query.id,
          manager: manager._id,
          school: manager.school,
        });
        if (!student) {
          return res
            .status(404)
            .json({ error: "دانش آموز یافت نشد", success: false });
        }
        return res.json({ student, success: true });
      }
      case "PUT": {
        const exceptedProps = [
          "firstName",
          "lastName",
          "nationalCode",
          "parentPhone",
          "birthDay",
        ];
        const isBodyPropsValid = exceptedProps.every((prop) => req.body[prop]);
        if (!isBodyPropsValid) {
          return res.status(422).json({
            error: "فرمت یا مقدار فیلد معتبر نیست",
            success: false,
          });
        }
        const manager = await managerModel.findOne({ nationalCode });
        if (!manager) {
          return res
            .status(403)
            .json({ error: "دسترسی غیر مجاز", success: false });
        }
        const student = await studentModel.findOneAndUpdate(
          {
            _id: req.query.id,
            manager: manager._id,
            school: manager.school,
          },
          { ...req.body }
        );

        if (!student) {
          return res
            .status(404)
            .json({ error: "دانش آموز یافت نشد", success: false });
        }
        return res.json({
          message: "اطلاعات دانش آموز با موفقیت تغییر کرد",
          success: true,
        });
      }

      case "DELETE": {
        const manager = await managerModel.findOne({ nationalCode });
        if (!manager) {
          return res
            .status(403)
            .json({ error: "دسترسی غیر مجاز", success: false });
        }
        const student = await studentModel.findOneAndDelete({
          _id: req.query.id,
          manager: manager._id,
          school: manager.school,
        });

        if (!student) {
          return res
            .status(404)
            .json({ error: "دانش آموز یافت نشد", success: false });
        }
        return res.json({
          message: "دانش آموز با موفقیت حذف شد",
          success: true,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
