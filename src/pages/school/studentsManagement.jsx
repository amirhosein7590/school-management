import PageGuide from "@/components/modules/pageGuide";
import AddStudent from "@/components/templates/studentsManagement/addStudent";
import ShowStudents from "@/components/templates/studentsManagement/showStudents";
import { requireRole } from "@/lib/requireRole";
import React, { memo } from "react";

function StudentsManagement({ user }) {
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
