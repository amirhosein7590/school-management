import connectToDb from "@/utils/db";
import findUserByProp from "@/utils/findUserByProp";
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
          const user = await findUserByProp("nationalCode", nationalCode);
          if (!user) {
            return res
              .status(422)
              .json({ error: "دسترسی غیر مجاز", success: false });
          }
          const notification = user.notifications.find(
            (notif) => notif._id == req.query.id
          );
          if (!notification) {
            return res
              .status(404)
              .json({ error: "اعلان یافت نشد", success: false });
          }
          user.notifications = user.notifications.filter(
            (notif) => notif._id != req.query.id
          );
          user.save();
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
