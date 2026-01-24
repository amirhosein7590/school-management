import Form from "@/components/modules/Form";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import React, { memo } from "react";

function StudentsClassification({ user }) {
  return (
    <div
      dir="rtl"
      className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
    >
      <PageGuide
        pageName="کلاس بندی دانش آموزان"
        entityName="studentsClassification"
      />
      <Form
        entityName="studentsClassification"
        user={user}
        inputsContainerClassName="flex flex-col gap-y-3 gap-x-0 lg:flex-row lg:gap-y-0 lg:gap-x-3 lg:items-center mb-4"
        submitButtonText="ذخیره تغییرات"
        submitButtonClassName="w-full flex item-center justify-center lg:w-auto"
        clearFormButton={false}
      />
    </div>
  );
}

export default memo(StudentsClassification);
export const getServerSideProps = requireRole("studentsClassification")();
