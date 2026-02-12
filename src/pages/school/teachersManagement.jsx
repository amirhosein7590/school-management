import PageGuide from "@/components/modules/pageGuide";
import AddTeacher from "@/components/templates/teachersManagement/addTeacher";
import ShowTeachers from "@/components/templates/teachersManagement/showTeachers";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function TeachersManagement({ user }) {
  return (
    <>
      <Head>
        <title>مدیریت معلمان</title>
        <meta name="description" content="صفحه مدیریت معلمان" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide pageName="مدیریت معلمان" entityName="teachersManagement" />
        <AddTeacher user={user} />
        <ShowTeachers user={user} />
      </div>
    </>
  );
}

export default memo(TeachersManagement);
export const getServerSideProps = requireRole("teachersManagement")();
