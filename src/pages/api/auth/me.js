import managerModel from "@/models/manager";
import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import connectToDb from "@/utils/db";
import { verifyToken } from "@/utils/tokenConf";

const roleModels = {
  owner: {
    model: ownerModel,
    rejectedProps: "-__v -password",
  },
  manager: {
    model: managerModel,
    rejectedProps: "-__v -password -actionsPermissions",
  },
  teacher: {
    model: teacherModel,
    rejectedProps: "-__v -password -actionsPermissions",
  },
};

export default async function GetMe(req, res) {
  try {
    if (req.method != "GET") {
      return res
        .status(400)
        .json({ error: "این درخواست مجاز نیست", success: false });
    }

    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ error: "لطفا وارد حساب کاربری خود شوید", success: false });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken?.nationalCode || !decodedToken?.role) {
      return res
        .status(409)
        .json({ error: "دسترسی شما نامعتبر است", success: false });
    }
    await connectToDb();
    const user = await roleModels[decodedToken?.role].model.findOne(
      {
        nationalCode: decodedToken?.nationalCode,
      },
      roleModels[decodedToken?.role].rejectedProps,
    );
    return res.json({ user, success: true });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
