import Form from "@/components/modules/Form";
import React, { memo } from "react";

function AddTeacher({ user }) {
  return (
    <Form
      entityName="addTeacher"
      user={user}
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      submitButtonText="ایجاد معلم"
    />
  );
}

export default memo(AddTeacher);

