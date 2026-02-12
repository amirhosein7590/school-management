import MessageCard from "@/components/modules/Card/MessageCard";
import { requireRole } from "@/lib/requireRole";
import { MessagesSquare } from "lucide-react";
import Head from "next/head";
import React, { memo } from "react";

function Message() {
  return (
    <>
      <Head>
        <title>پنل پیامکی</title>
        <meta name="description" content="صفحه پنل پیامکی" />
      </Head>
      <div
        dir="rtl"
        className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
      >
        <div className="description gap-x-2 flex flex-col gap-y-2">
          <div className="text-gray-500 text-sm flex items-center gap-x-2">
            <MessagesSquare size={20} /> پنل پیامکی جهت اطلاع رسانی در غیبت های
            معلمان و دانش آموزان قابل استفاده است
          </div>
          <div className="text-gray-500 text-sm">
            شماره تماس جهت دریافت قیمت و خرید:09375117590
          </div>
        </div>
        <MessageCard />
      </div>
    </>
  );
}

export default memo(Message);
export const getServerSideProps = requireRole("message")();
