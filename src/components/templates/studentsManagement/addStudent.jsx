import React, { memo } from "react";
import Form from "../../modules/Form";

function AddStudent({ user }) {
  const validSearchProps = [
    "firstName",
    "lastName",
    "parentPhone",
    "nationalCode",
    "birthDay",
    "class",
    "grade"
  ];
  return (
    <Form
      entityName="addStudent"
      user={user}
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      submitButtonText="ایجاد دانش آموز"
      submitButtonClassName="w-full flex item-center justify-center lg:w-auto"
      search={true}
      validSearchProps={validSearchProps}
      countEntityButton={true}
      exportToExcel={true}
      importFromExcel={true}
      importFromExcelButtonText="ایجاد گروهی دانش آموزان"
    />
  );
}

export default memo(AddStudent);
