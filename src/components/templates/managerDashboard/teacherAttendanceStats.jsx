import AttendanceCard from "@/components/modules/Card/AttendanceCard";
import { Spinner } from "@/components/modules/spinner";
import useCustomeQuery from "@/hooks/useCustomeQuery";
import React, { memo } from "react";

function TeacherAttendanceStats() {
  const { data, isPending } = useCustomeQuery(
    "teacherAttendanceStats",
    null,
    "/teachers/attendanceStats",
    null,
    true
  );

  if (isPending)
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
        data={data?.data?.absentOverThreshold}
        key="absentOverThreshold"
      />
      <AttendanceCard
        title="متاخر ترین معلم"
        entityName="teacher"
        data={data?.data?.mostLate}
        key="mostLate"
      />
      <AttendanceCard
        title="معلم بدون هیچ غیبت"
        entityName="teacher"
        data={data?.data?.neverAbsent}
        key="neverAbsent"
      />
    </div>
  );
}

export default memo(TeacherAttendanceStats);
