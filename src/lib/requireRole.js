import { jwtVerify } from "jose";
import { canAccessPage } from "./permission";

export function requireRole(page) {
  return function (gssp) {
    return async function (context) {
      const { req } = context;
      const { token } = req.cookies;
      const secret = new TextEncoder().encode(process.env.jwtSignature);

      let user;
      try {
        const { payload } = await jwtVerify(token, secret);
        user = payload;
      } catch {
        return {
          redirect: { destination: "/auth/login", permanent: false },
        };
      }

      if (!user?.role || !canAccessPage(page, user.role)) {
        return { redirect: { destination: "/auth/login", permanent: false } };
      }

      return gssp ? await gssp({ ...context, user }) : { props: { user } };
    };
  };
}
