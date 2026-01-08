import DataTable from "@/components/modules/dataTable";
import React from "react";

function ShowTeachers({ user }) {
  return (
    <DataTable
      entityName="editDeleteTeacher"
      user={user}
      enableRowSelection={true}
      infiniteScroll={true}
      search={true}
    />
  );
}

export default ShowTeachers;
