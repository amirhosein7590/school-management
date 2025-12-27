import { verifyToken } from "@/utils/tokenConf";

function Index() {
  return <></>;
}

export default Index;

export async function getServerSideProps(context) {
  const { token, refreshToken } = context.req.cookies;
  if (!token && !refreshToken) {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
  }
  const { role } = verifyToken(token || refreshToken);
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
        destination: "/school/home",
      },
    };
  }
  return {
    props: {},
  };
}
