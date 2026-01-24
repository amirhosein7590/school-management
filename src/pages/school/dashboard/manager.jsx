import TeacherAttendanceStats from "@/components/templates/managerDashboard/teacherAttendanceStats";
import { requireRole } from "@/lib/requireRole";
import React, { memo } from "react";

function ManagerDashboard({user}) {
  return <div dir="rtl" className="flex flex-col gap-y-10">
        <TeacherAttendanceStats />
  </div>;
}

export default memo(ManagerDashboard);
export const getServerSideProps = requireRole("ManagerDashboard")();
