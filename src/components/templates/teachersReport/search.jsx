import Form from "@/components/modules/Form";
import React, { memo } from "react";

function search({ user }) {
  const validSearchProps = ["status", "teachers", "fromDate", "toDate"];

  return (
    <Form
      user={user}
      entityName="searchTeacherReport"
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      search={true}
      validSearchProps={validSearchProps}
      countEntityButton={false}
      submitButton={false}
      searchEndPoint={false}
      exportToExcel={true}
    />
  );
}

export default memo(search);
