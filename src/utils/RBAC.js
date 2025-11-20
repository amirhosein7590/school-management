import { isValidObjectId } from "mongoose";
import { verifyToken } from "./tokenConf";

export default function RBAC(
  req,
  res,
  allowRoles = [],
  isIdRequired = { status: false, errorMessage: "" }
) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "لطفا وارد حساب کاربری خود شوید" });
  }
  try {
    const { nationalCode, role } = verifyToken(token);
    if (!nationalCode || !role) {
      return res.status(422).json({ error: "دسترسی غیر مجاز", success: false });
    }
    if (!allowRoles.includes(role)) {
      return res.status(422).json({ error: "دسترسی غیر مجاز", success: false });
    }

    if (isIdRequired.status) {
      if (!req.query?.id || !isValidObjectId(req.query?.id)) {
        return res
          .status(422)
          .json({ error: isIdRequired.errorMessage, success: false });
      }
    }

    return { nationalCode, role };
  } catch (error) {
    return res.status(422).json({ error: "دسترسی غیر مجاز", success: false });
  }
}
