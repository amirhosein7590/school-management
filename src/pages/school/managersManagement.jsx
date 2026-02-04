import PageGuide from "@/components/modules/pageGuide";
import AddManager from "@/components/templates/managersManagement/addManager";
import ShowManagers from "@/components/templates/managersManagement/showManagers";
import { requireRole } from "@/lib/requireRole";
import pageNameHandler from "@/utils/pageNameHandler";
import React, { memo, useEffect } from "react";

function ManagersManagement({ user, pageName }) {
  useEffect(() => {
    pageNameHandler(pageName);
  }, []);
  return (
    <div
      dir="rtl"
      className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
    >
      <PageGuide pageName="مدیریت مدیران" entityName="managersManagement" />
      <AddManager user={user} />
      <ShowManagers user={user} />
    </div>
  );
}

export default memo(ManagersManagement);
export const getServerSideProps = requireRole("managersManagement")();
