import PageGuide from "@/components/modules/pageGuide";
import AddClass from "@/components/templates/ClassesManagement/addClass";
import ShowClasses from "@/components/templates/ClassesManagement/showClasses";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function ClassesManagement({ user }) {
  return (
    <>
      <Head>
        <title>مدیریت کلاس ها</title>
        <meta name="description" content="صفحه مدیریت کلاس ها" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide pageName="مدیریت کلاس ها" entityName="classesManagement" />
        <AddClass user={user} />
        <ShowClasses user={user} />
      </div>
    </>
  );
}

export default memo(ClassesManagement);
export const getServerSideProps = requireRole("classesManagement")();
