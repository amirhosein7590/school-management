import DataTable from "@/components/modules/dataTable";
import React, { memo } from "react";

function ShowManagers({ user }) {
  return (
    <DataTable
      entityName="editDeleteManager"
      user={user}
      enableRowSelection={true}
      infiniteScroll={true}
      search={true}
    />
  );
}

export default memo(ShowManagers);
