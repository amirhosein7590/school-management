import Form from "@/components/modules/Form";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function SetSchool({ user }) {
  return (
    <>
      <Head>
        <title>مدرسه بندی مدیران</title>
        <meta name="description" content="صفحه مدرسه بندی مدیران" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide entityName="setSchool" pageName="مدرسه بندی مدیران" />
        <Form
          user={user}
          entityName="setSchool"
          submitButtonText="ذخیره تغییرات"
          submitButtonClassName="w-full lg:w-auto flex justify-center items-center"
          inputsContainerClassName="flex items-center gap-x-4"
        />
      </div>
    </>
  );
}

export default memo(SetSchool);
export const getServerSideProps = requireRole("setSchool")();
