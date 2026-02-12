import PageGuide from "@/components/modules/pageGuide";
import Search from "@/components/templates/studentsReport/search";
import ShowReport from "@/components/templates/studentsReport/showReport";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function StudentsReport({ user }) {
  return (
    <>
      <Head>
        <title>گزارش گیری دانش آموزان</title>
        <meta name="description" content="صفحه گزارش گیری دانش آموزان" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide
          entityName="studentsReport"
          pageName="گزارش گیری دانش آموزان"
        />
        <Search user={user} />
        <ShowReport user={user} />
      </div>
    </>
  );
}

export default memo(StudentsReport);
export const getServerSideProps = requireRole("studentsReport")();
