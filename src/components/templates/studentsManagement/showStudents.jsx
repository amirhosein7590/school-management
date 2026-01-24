import DataTable from "@/components/modules/dataTable";
import React, { memo } from "react";

function ShowStudents({ user }) {
  return (
    <DataTable
      entityName="editDeleteStudent"
      user={user}
      enableRowSelection={true}
      infiniteScroll={true}
    />
  );
}

export default memo(ShowStudents);
