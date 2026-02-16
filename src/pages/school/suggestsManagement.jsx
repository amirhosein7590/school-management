import DataTable from "@/components/modules/dataTable";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import Head from "next/head";
import React, { memo } from "react";

function SuggestsManagement({ user }) {
  return (
    <>
      <Head>
        <title>مدیریت پیشنهادات / انتقادات</title>
        <meta name="description" content="صفحه پیشنهادات / انتقادات" />
      </Head>
      ;
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <PageGuide
          pageName="پیشنهادات / انتقادات"
          entityName="SuggestsManagement"
        />
        <DataTable
          enableRowSelection={true}
          entityName="editDeleteSuggest"
          user={user}
        />
      </div>
    </>
  );
}

export default memo(SuggestsManagement);
export const getServerSideProps = requireRole("SuggestsManagement")();
