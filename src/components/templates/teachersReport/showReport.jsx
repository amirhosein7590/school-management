import DataTable from "@/components/modules/dataTable";
import React, { memo } from "react";

function ShowReport({ user }) {
  return (
    <div className="table-container mt-10">
      <DataTable
        user={user}
        enableRowSelection={false}
        entityName="showTeacherReport"
      />
    </div>
  );
}

export default memo(ShowReport);
