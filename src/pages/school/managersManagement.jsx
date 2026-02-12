import PageGuide from "@/components/modules/pageGuide";
import AddManager from "@/components/templates/managersManagement/addManager";
import ShowManagers from "@/components/templates/managersManagement/showManagers";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function ManagersManagement({ user }) {
  return (
    <>
      <Head>
        <title>مدیریت مدیران</title>
        <meta name="description" content="صفحه مدیریت مدیران" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide pageName="مدیریت مدیران" entityName="managersManagement" />
        <AddManager user={user} />
        <ShowManagers user={user} />
      </div>
    </>
  );
}

export default memo(ManagersManagement);
export const getServerSideProps = requireRole("managersManagement")();
