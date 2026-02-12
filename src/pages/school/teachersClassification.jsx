import Form from "@/components/modules/Form";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function TeachersClassification({ user }) {
  return (
    <>
      <Head>
        <title>کلاس بندی معلمان</title>
        <meta name="description" content="صفحه کلاس بندی معلمان" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide
          pageName="کلاس بندی معلمان"
          entityName="teachersClassification"
        />
        <Form
          entityName="teachersClassification"
          user={user}
          inputsContainerClassName="flex flex-col gap-y-3 gap-x-0 lg:flex-row lg:gap-y-0 lg:gap-x-3 lg:items-center mb-4"
          submitButtonText="ذخیره تغییرات"
          submitButtonClassName="w-full flex item-center justify-center lg:w-auto"
          clearFormButton={false}
        />
      </div>
    </>
  );
}

export default memo(TeachersClassification);
export const getServerSideProps = requireRole("teachersClassification")();
