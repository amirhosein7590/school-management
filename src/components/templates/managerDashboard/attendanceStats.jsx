import AttendanceCard from "@/components/modules/Card/AttendanceCard";
import { Spinner } from "@/components/modules/spinner";
import useCustomeQuery from "@/hooks/useCustomeQuery";
import React, { memo } from "react";

function AttendanceStats() {
  const { data: teachers, isPending: teachersPending } = useCustomeQuery(
    "teacherAttendanceStats",
    null,
    "/teachers/attendanceStats",
    null,
    true
  );

  const { data: students, isPending: studentsPending } = useCustomeQuery(
    "studentAttendanceStats",
    null,
    "/students/attendanceStats",
    null,
    true
  );

  if (teachersPending || studentsPending)
    return (
      <div className="flex items-center w-full h-full justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttendanceCard
        entityName="teacher"
        title="معلمانی که بیش از سه بار غیبت کرده اند"
        data={teachers?.data?.absentOverThreshold}
        key="absentOverThreshold"
      />
      <AttendanceCard
        title="متاخر ترین معلم"
        entityName="teacher"
        data={teachers?.data?.mostLate}
        key="mostLate"
      />
      <AttendanceCard
        title="معلمان بدون هیچ غیبت"
        entityName="teacher"
        data={teachers?.data?.neverAbsent}
        key="neverAbsent"
      />

      <AttendanceCard
        entityName="student"
        title="دانش آموزانی که بیش از سه بار غیبت کرده اند"
        data={students?.data?.absentOverThreshold}
        key="absentOverThreshold"
      />
      <AttendanceCard
        title="متاخر ترین دانش آموز"
        entityName="student"
        data={students?.data?.mostLate}
        key="mostLate"
      />
      <AttendanceCard
        title="دانش آموزان بدون هیچ غیبت"
        entityName="student"
        data={students?.data?.neverAbsent}
        key="neverAbsent"
      />
    </div>
  );
}

export default memo(AttendanceStats);
