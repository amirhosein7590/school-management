import Form from "@/components/modules/Form";
import React, { memo } from "react";

function AddAttendance({ user }) {
  const validSearchProps = ["teachers", "status", "date"];
  return (
    <Form
      mode="attendance"
      entityName="addTeacherAttendance"
      user={user}
      inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
      submitButtonText="ثبت"
      submitButtonClassName="w-full lg:w-auto flex justify-center items-center"
      search={true}
      validSearchProps={validSearchProps}
      countEntityButton={false}
    />
  );
}

export default memo(AddAttendance);
