import Form from "@/components/modules/Form";
import React, { memo } from "react";

function AddClass({ user }) {
  const validSearchProps = ["name", "grade"];
  return (
    <Form
      entityName="addClass"
      user={user}
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      submitButtonText="ایجاد کلاس"
      submitButtonClassName="w-full lg:w-auto flex justify-center items-center"
      search={true}
      validSearchProps={validSearchProps}
      countEntityButton={true}
      exportToExcel={true}
    />
  );
}

export default memo(AddClass);
