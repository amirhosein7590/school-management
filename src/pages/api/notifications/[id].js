import connectToDb from "@/utils/db";
import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import RBAC from "@/utils/RBAC";

export default async function SingleNotification(req, res) {
  const auth = RBAC(req, res, ["owner", "manager", "teacher"], {
    status: true,
    errorMessage: "اعلان یافت نشد",
  });

  if (!auth) return;
  const { nationalCode, role } = auth;

  try {
    await connectToDb();
    switch (req.method) {
      case "DELETE": {
        if (role == "owner") {
          // will complete later
        } else {
          let userModel;
          if (role === "owner") {
            userModel = await ownerModel.findOne({ nationalCode });
          } else if (role === "teacher") {
            userModel = await teacherModel.findOne({ nationalCode });
          } else if (role === "manager") {
            userModel = await managerModel.findOne({ nationalCode });
          }

          if (!userModel) {
            return res
              .status(422)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }

          const notification = userModel.notifications.find(
            (notif) => notif._id.toString() == req.query.id,
          );

          if (!notification) {
            return res
              .status(404)
              .json({ error: "اعلان یافت نشد", success: false });
          }

          userModel.notifications = userModel.notifications.filter(
            (notif) => notif._id.toString() != req.query.id,
          );
          await userModel.save();
          return res.json({ message: "اعلان با موفقیت حذف شد", success: true });
        }
      }

      default: {
        return res.status(400).json({ error: "خطای ناشناخته", success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
