import React, { memo } from "react";
import Form from "../../modules/Form";

function AddStudent({ user }) {
  const validSearchProps = [
    "name",
    "school",
    "shift",
    "level",
    "gender",
    "manager",
  ];
  return (
    <Form
      entityName="addSchool"
      user={user}
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      submitButtonText="ایجاد مدرسه"
      submitButtonClassName="w-full flex item-center justify-center lg:w-auto"
      search={true}
      validSearchProps={validSearchProps}
      countEntityButton={true}
      exportToExcel={true}
    />
  );
}

export default memo(AddStudent);
