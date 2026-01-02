import DataTable from "@/components/modules/dataTable";
import React, { memo } from "react";

function ShowMessages({ user }) {
  return <DataTable user={user} entityName="inSystemMessage" />;
}

export default memo(ShowMessages);
