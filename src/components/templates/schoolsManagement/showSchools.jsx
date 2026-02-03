import DataTable from "@/components/modules/dataTable";
import React, { memo } from "react";

function ShowSchools({ user }) {
  return (
    <DataTable
      entityName="editDeleteSchool"
      user={user}
      enableRowSelection={true}
      infiniteScroll={true}
    />
  );
}

export default memo(ShowSchools);
