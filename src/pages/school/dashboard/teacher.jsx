import AttendanceStats from "@/components/templates/teacherDashboard/attendanceStats";
import { requireRole } from "@/lib/requireRole";
import React, { memo } from "react";

function TeacherDashboard() {
  return (
    <div dir="rtl" className="flex flex-col gap-y-10">
      <AttendanceStats />
    </div>
  );
}

export default memo(TeacherDashboard);
export const getServerSideProps = requireRole("TeacherDashboard")();
