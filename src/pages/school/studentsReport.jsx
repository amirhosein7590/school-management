import PageGuide from "@/components/modules/pageGuide";
import Search from "@/components/templates/studentsReport/search";
import ShowReport from "@/components/templates/studentsReport/showReport";
import { requireRole } from "@/lib/requireRole";
import pageNameHandler from "@/utils/pageNameHandler";
import React, { useEffect } from "react";

function StudentsReport({ user, pageName }) {
  useEffect(() => {
    pageNameHandler(pageName);
  }, []);
  return (
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
  );
}

export default StudentsReport;
export const getServerSideProps = requireRole("studentsReport")();
