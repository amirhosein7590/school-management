import DataTable from "@/components/modules/dataTable";
import React, { memo } from "react";

function ShowClasses({ user }) {
  return (
    <DataTable
      entityName="editDeleteClass"
      user={user}
      enableRowSelection={true}
    />
  );
}

export default memo(ShowClasses);
