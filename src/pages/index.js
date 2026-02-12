// import { verifyToken } from "@/utils/tokenConf";

import Head from "next/head";

function Index() {
  return (
    <>
      <Head>
        <title>صفحه اصلی</title>
        <meta name="description" content="صفحه اصلی" />
      </Head>
    </>
  );
}

export default Index;

// export async function getServerSideProps(context) {
//   const { token, refreshToken } = context.req.cookies;
//   if (!token && !refreshToken) {
//     return {
//       redirect: {
//         destination: "/auth/login",
//       },
//     };
//   }
//   const { role } = verifyToken(token || refreshToken);
//   if (!role?.trim()) {
//     return {
//       redirect: {
//         destination: "/auth/login",
//       },
//     };
//   }
//   if (role.trim()) {
//     return {
//       redirect: {
//         destination: "/school/home",
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// }
