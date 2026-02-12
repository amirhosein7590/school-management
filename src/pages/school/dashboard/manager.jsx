import AttendanceStats from "@/components/templates/managerDashboard/attendanceStats";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function ManagerDashboard() {
  return (
    <>
      <Head>
        <title>داشبورد</title>
        <meta name="description" content="صفحه داشبورد مدیر" />
      </Head>
      <div dir="rtl" className="flex flex-col gap-y-10">
        <AttendanceStats />
      </div>
    </>
  );
}

export default memo(ManagerDashboard);
export const getServerSideProps = requireRole("ManagerDashboard")();
