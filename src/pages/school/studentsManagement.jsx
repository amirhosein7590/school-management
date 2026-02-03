import PageGuide from "@/components/modules/pageGuide";
import AddStudent from "@/components/templates/studentsManagement/addStudent";
import ShowStudents from "@/components/templates/studentsManagement/showStudents";
import { requireRole } from "@/lib/requireRole";
import pageNameHandler from "@/utils/pageNameHandler";
import React, { memo, useEffect } from "react";

function StudentsManagement({ user, pageName }) {
  useEffect(() => {
    pageNameHandler(pageName);
  }, []);
  return (
    <div
      dir="rtl"
      className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
    >
      <PageGuide
        pageName="مدیریت دانش آموزان"
        entityName="studentsManagement"
      />
      <AddStudent user={user} />
      <ShowStudents user={user} />
    </div>
  );
}

export default memo(StudentsManagement);
export const getServerSideProps = requireRole("studentsManagement")();
