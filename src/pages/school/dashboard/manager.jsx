import AttendanceStats from "@/components/templates/managerDashboard/attendanceStats";
import { requireRole } from "@/lib/requireRole";
import React, { memo, useEffect } from "react";
import pageNameHandler from "@/utils/pageNameHandler";

function ManagerDashboard({ pageName }) {
  useEffect(() => {
    pageNameHandler(pageName);
  }, []);
  return (
    <div dir="rtl" className="flex flex-col gap-y-10">
      <AttendanceStats />
    </div>
  );
}

export default memo(ManagerDashboard);
export const getServerSideProps = requireRole("ManagerDashboard")();
