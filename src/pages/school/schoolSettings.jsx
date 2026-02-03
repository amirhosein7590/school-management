import Form from "@/components/modules/Form";
import PageGuide from "@/components/modules/pageGuide";
import useCustomeQuery from "@/hooks/useCustomeQuery";
import { requireRole } from "@/lib/requireRole";
import pageNameHandler from "@/utils/pageNameHandler";
import React, { useEffect } from "react";

function SchoolSettings({ user, pageName }) {
  useEffect(() => {
    pageNameHandler(pageName);
  }, []);
  const { data, isPending } = useCustomeQuery(
    "me",
    null,
    "/auth/me",
    null,
    true,
  );
  if (isPending) {
    return "";
  }
  const { _id } = data?.user?.school;
  return (
    <div
      dir="rtl"
      className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
    >
      <PageGuide entityName="schoolSettings" pageName="تنظیمات مدرسه" />
      <Form
        user={user}
        entityName="schoolSettings"
        mode="edit"
        inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
        submitButtonText="ذخیره تغییرات"
        submitButtonClassName="w-full lg:w-auto flex justify-center items-center"
        entityId={_id}
        queryOptions={{ paramId: { id: _id } }}
        clearFormButton={false}
      />
    </div>
  );
}

export default SchoolSettings;
export const getServerSideProps = requireRole("schoolSettings")();
