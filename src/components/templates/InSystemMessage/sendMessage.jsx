import Form from "@/components/modules/Form";
import React, { memo } from "react";

function SendMessage({ user }) {
  return (
    <Form
      entityName="inSystemMessage"
      user={user}
      submitButtonText="ارسال"
      className="flex flex-col lg:block"
      inputsContainerClassName="flex flex-col lg:flex-row gap-x-3 lg:items-center mb-3"
      submitButtonClassName="px-5 flex justify-center items-center !rounded-sm"
    />
  );
}

export default memo(SendMessage);
