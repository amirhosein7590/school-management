import DataTable from "@/components/modules/dataTable";
import React, { memo } from "react";

function ShowAttendances({ user }) {
  return (
    <div className="table-container mt-10">
      <DataTable
        user={user}
        enableRowSelection={true}
        entityName="editDeleteStudentAttendances"
      />
    </div>
  );
}

export default memo(ShowAttendances);
