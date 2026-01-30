import Form from "@/components/modules/Form";
import React, { memo } from "react";

function AddTeacher({ user }) {
  const validSearchProps = [
    "firstName",
    "lastName",
    "phone",
    "nationalCode",
    "personnelCode",
    "birthDay",
    "gender",
    "class",
  ];

  return (
    <Form
      entityName="addTeacher"
      user={user}
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      submitButtonText="ایجاد معلم"
      submitButtonClassName="w-full lg:w-auto flex justify-center items-center"
      search={true}
      validSearchProps={validSearchProps}
      countEntityButton={true}
      exportToExcel={true}
      importFromExcel={true}
      importFromExcelButtonText="ایجاد گروهی معلمان"
    />
  );
}

export default memo(AddTeacher);
