import connectToDb from "@/utils/db";
import findUserByProps from "@/utils/findUserByProps";
import RBAC from "@/utils/RBAC";
import ownerModel from "@/models/owner";
import teacherModel from "@/models/teacher";
import managerModel from "@/models/manager";

export default async function Account(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ error: "این درخواست مجاز نیست", success: false });
  }

  const auth = RBAC(req, res, ["owner", "teacher", "manager"], {
    status: false,
  });

  if (!auth) return;
  const { nationalCode, role } = auth;

  const roleExceptedProp = {
    teacher: [
      "userName",
      "phone",
      "firstName",
      "lastName",
      "nationalCode",
      "personnelCode",
      "birthDay",
    ],
    manager: [
      "userName",
      "phone",
      "firstName",
      "lastName",
      "nationalCode",
      "personnelCode",
    ],
    owner: ["userName", "phone", "firstName", "lastName", "nationalCode"],
  };
  const models = {
    teacher: teacherModel,
    manager: managerModel,
    owner: ownerModel,
  };
  const isBodyPropValid = roleExceptedProp[role].every(
    (prop) => req.body[prop] && req.body[prop].trim()
  );

  if (!isBodyPropValid) {
    return res
      .status(422)
      .json({ error: "تمامی فیلد ها باید تکمیل شوند", success: false });
  }

  try {
    await connectToDb();
    const user = await models[role].findOne({ nationalCode });
    if (!user || user.role != role) {
      return res
        .status(401)
        .json({ error: "لطفا وارد حساب کاربری خود شوید", success: false });
    }

    const update = await models[role].findOneAndUpdate(
      { nationalCode },
      req.body
    );

    if (!update) {
      return res.status(404).json({ error: "کاربر یافت نشد", success: false });
    }

    return res.json({
      message: "اطلاعات حساب کاربری تغییر یافت",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: "خطای ناشناخته", success: false });
  }
}
