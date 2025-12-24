import ROLE_REDIRECT_MAP from "@/constants/auth/roleRedirect";
import { verifyToken } from "@/utils/tokenConf";

function Index() {
  return <></>;
}

export default Index;

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
  }
  const { role } = verifyToken(token);
  if (!role?.trim()) {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
  }
  if (role.trim()) {
    return {
      redirect: {
        destination: ROLE_REDIRECT_MAP[role],
      },
    };
  }
  return {
    props: {},
  };
}
