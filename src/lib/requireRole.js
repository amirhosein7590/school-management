import { jwtVerify } from "jose";
import { canAccessPage } from "./permission";
import findUserByProp from "@/utils/findUserByProp";

export function requireRole(page) {
  return function (gssp) {
    return async function (context) {
      const { req } = context;
      const { token, refreshToken } = req.cookies;
      const secret = new TextEncoder().encode(process.env.jwtSignature);

      const currentPath = context.resolvedUrl || context.req?.url || "";
      const isErrorPage =
        currentPath.includes("/404") ||
        currentPath.includes("/500") ||
        currentPath.includes("/_error") ||
        currentPath.includes("/_app") ||
        currentPath === "/error";

      if (isErrorPage) {
        try {
          return gssp ? await gssp(context) : { props: {} };
        } catch {
          return { props: {} };
        }
      }

      let user;
      try {
        const { payload } = await jwtVerify(token || refreshToken, secret);
        user = payload;
      } catch {
        return {
          redirect: { destination: "/auth/login", permanent: false },
        };
      }

      if (!user?.role || !canAccessPage(page, user.role)) {
        return { redirect: { destination: "/auth/login", permanent: false } };
      }

      const entity = await findUserByProp("nationalCode", user.nationalCode);
      if (entity?.isBanned) {
        return { redirect: { destination: "/auth/login", permanent: false } };
      }

      if (user?.expTime < Date.now()) {
        return { redirect: { destination: "/auth/login", permanent: false } };
      }

      return gssp
        ? await gssp({ ...context, user, pageName: page })
        : { props: { user, pageName: page } };
    };
  };
}
