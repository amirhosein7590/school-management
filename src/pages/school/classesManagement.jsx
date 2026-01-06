import PageGuide from "@/components/modules/pageGuide";
import AddClass from "@/components/templates/ClassesManagement/addClass";
import ShowClasses from "@/components/templates/ClassesManagement/showClasses";
import { requireRole } from "@/lib/requireRole";
import React from "react";

function ClassesManagement({ user }) {
  return (
    <div
      dir="rtl"
      className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
    >
      <PageGuide pageName="مدیریت کلاس ها" entityName="classesManagement" />
      <AddClass user={user} />
      <ShowClasses user={user} />
    </div>
  );
}

export default ClassesManagement;
export const getServerSideProps = requireRole("classesManagement")();
