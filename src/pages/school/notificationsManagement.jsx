import Form from "@/components/modules/Form";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function NotificationsManagement({ user }) {
  return (
    <>
      <Head>
        <title>مدیریت اعلانات</title>
        <meta name="description" content="صفحه مدیریت اعلانات" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide
          pageName="مدیریت اعلانات"
          entityName="notificationsManagement"
        />
        <Form
          user={user}
          entityName="addNotification"
          submitButtonText="ارسال اعلان"
          inputsContainerClassName="flex flex-col flex-wrap gap-y-2 lg:justify-between lg:items-center lg:flex-row lg:gap-x-2 mb-4"
          submitButtonClassName="flex justify-center items-center"
        />
      </div>
    </>
  );
}

export default memo(NotificationsManagement);
export const getServerSideProps = requireRole("notificationsManagement")();
