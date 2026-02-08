import AttendanceStats from "@/components/templates/teacherDashboard/attendanceStats";
import { requireRole } from "@/lib/requireRole";
import pageNameHandler from "@/utils/pageNameHandler";
import React, { memo, useEffect } from "react";

function TeacherDashboard({ pageName }) {
  useEffect(() => {
    pageNameHandler(pageName);
  }, []);
  return (
    <div dir="rtl" className="flex flex-col gap-y-10">
      <AttendanceStats />
    </div>
  );
}

export default memo(TeacherDashboard);
export const getServerSideProps = requireRole("TeacherDashboard")();
