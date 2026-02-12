import Form from "@/components/modules/Form";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function MangersPermissions({ user }) {
  return (
    <>
      <Head>
        <title>محدودیت مدیران</title>
        <meta name="description" content="صفحه محدودیت مدیران" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide pageName="محدودیت مدیران" entityName="managerPermissions" />
        <Form
          user={user}
          entityName="managerPermissions"
          inputsContainerClassName="flex items-center gap-x-4"
          submitButtonText="اعمال محدودیت"
        />
      </div>
    </>
  );
}

export default memo(MangersPermissions);
export const getServerSideProps = requireRole("managerPermissions")();
