import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import React, { memo } from "react";
import Search from "@/components/templates/teachersReport/search";
import ShowReport from "@/components/templates/teachersReport/showReport";

function TeachersReport({ user }) {
  return (
    <div
      dir="rtl"
      className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
    >
      <PageGuide entityName="teachersReport" pageName="گزارش گیری معلمان" />
      <Search user={user} />
      <ShowReport user={user} />
    </div>
  );
}

export default memo(TeachersReport);
export const getServerSideProps = requireRole("teachersReport")();
