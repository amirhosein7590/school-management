import PageGuide from "@/components/modules/pageGuide";
import AddSchool from "@/components/templates/schoolsManagement/addSchool";
import ShowSchools from "@/components/templates/schoolsManagement/showSchools";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function SchoolsManagement({ user }) {
  return (
    <>
      <Head>
        <title>مدیریت مدارس</title>
        <meta name="description" content="صفحه مدیریت مدارس" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide entityName="schoolsManagement" pageName="مدیریت مدارس" />
        <AddSchool user={user} />
        <ShowSchools user={user} />
      </div>
    </>
  );
}

export default memo(SchoolsManagement);
export const getServerSideProps = requireRole("schoolsManagement")();
