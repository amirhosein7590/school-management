import Form from "@/components/modules/Form";
import React, { memo } from "react";

function AddClass({ user }) {
  return (
    <Form
      entityName="addClass"
      user={user}
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      submitButtonClassName=""
      submitButtonText="ایجاد کلاس"
    />
  );
}

export default memo(AddClass);
