import Form from "@/components/modules/Form";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function Profile({ user }) {
  return (
    <>
      <Head>
        <title>پروفایل</title>
        <meta name="description" content="صفحه پروفایل" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide entityName="profile" pageName="پروفایل" />
        <Form
          user={user}
          entityName="profile"
          mode="edit"
          inputsContainerClassName="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-5"
          submitButtonText="ذخیره تغییرات"
          submitButtonClassName="w-full lg:w-auto flex justify-center items-center"
          clearFormButton={false}
        />
      </div>
    </>
  );
}

export default memo(Profile);

export const getServerSideProps = requireRole("profile")();
