import AttendanceStats from "@/components/templates/teacherDashboard/attendanceStats";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function TeacherDashboard() {
  return (
    <>
      <Head>
        <title>داشبورد</title>
        <meta name="description" content="صفحه داشبورد معلم" />
      </Head>
      <div dir="rtl" className="flex flex-col gap-y-10">
        <AttendanceStats />
      </div>
    </>
  );
}

export default memo(TeacherDashboard);
export const getServerSideProps = requireRole("TeacherDashboard")();
