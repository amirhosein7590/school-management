import PageGuide from "@/components/modules/pageGuide";
import AddAttendance from "@/components/templates/studentsAttendances/addAttendance";
import ShowAttendances from "@/components/templates/studentsAttendances/showAttendances";
import { requireRole } from "@/lib/requireRole";
import pageNameHandler from "@/utils/pageNameHandler";
import React, { memo, useEffect } from "react";

function StudentsAttendances({ user , pageName }) {
    useEffect(() => {
      pageNameHandler(pageName);
    }, []);
  return (
    <div
      dir="rtl"
      className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
    >
      <PageGuide
        entityName="studentsAttendances"
        pageName="حضور و غیاب دانش آموزان"
      />
      <AddAttendance user={user} />
      <ShowAttendances user={user} />
    </div>
  );
}

export default memo(StudentsAttendances);
export const getServerSideProps = requireRole("studentsAttendances")();
