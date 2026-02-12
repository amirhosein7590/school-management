import Form from "@/components/modules/Form";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function ChangePassword({ user }) {
  return (
    <>
      <Head>
        <title>تغییر رمز عبور</title>
        <meta name="description" content="صفحه تغییر رمز عبور" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide entityName="changePassword" pageName="تغییر رمز عبور" />
        <Form
          user={user}
          entityName="changePassword"
          inputsContainerClassName="flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-between gap-y-4 lg:gap-x-4 mb-5"
          submitButtonText="ذخیره تغییرات"
          submitButtonClassName="w-full lg:w-auto flex justify-center items-center"
          clearFormButton={false}
        />
      </div>
    </>
  );
}

export default memo(ChangePassword);

export const getServerSideProps = requireRole("changePassword")();
