import PageGuide from "@/components/modules/pageGuide";
import AddAttendance from "@/components/templates/teachersAttendances/addAttendance";
import ShowAttendances from "@/components/templates/teachersAttendances/showAttendances";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function TeachersAttendances({ user }) {
  return (
    <>
      <Head>
        <title>حضور و غیاب معلمان</title>
        <meta name="description" content="صفحه حضور و غیاب معلمان" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide
          entityName="teachersAttendances"
          pageName="حضور و غیاب معلمان"
        />
        <AddAttendance user={user} />
        <ShowAttendances user={user} />
      </div>
    </>
  );
}

export default memo(TeachersAttendances);
export const getServerSideProps = requireRole("teachersAttendances")();
