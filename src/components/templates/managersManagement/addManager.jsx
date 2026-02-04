import Form from "@/components/modules/Form";
import React, { memo } from "react";

function AddManager({ user }) {
  const validSearchProps = [
    "firstName",
    "lastName",
    "phone",
    "nationalCode",
    "personnelCode",
    "birthDay",
    "gender",
  ];

  return (
    <Form
      entityName="addManager"
      user={user}
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      submitButtonText="ایجاد مدیر"
      submitButtonClassName="w-full lg:w-auto flex justify-center items-center"
      search={true}
      validSearchProps={validSearchProps}
      countEntityButton={true}
      exportToExcel={true}
      importFromExcel={true}
      importFromExcelButtonText="ایجاد گروهی مدیران"
    />
  );
}

export default memo(AddManager);
