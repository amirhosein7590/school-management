import { Button } from "@/components/modules/Button/button";
import PackagesCard from "@/components/modules/Card/PackagesCard";
import PageGuide from "@/components/modules/pageGuide";
import { requireRole } from "@/lib/requireRole";
import pageNameHandler from "@/utils/pageNameHandler";
import React, { useEffect } from "react";

function Index({pageName }) {
  useEffect(() => {
    pageNameHandler(pageName);
  }, []);
  return (
    <div
      dir="rtl"
      className="px-2 bg-white shadow-sm py-2 lg:px-4 flex flex-col"
    >
      <PageGuide entityName="packages" pageName="بسته خریداری شده" />
      <div className="button-container flex">
        <Button href="/school/packages/message" size="sm" className="bg-[var(--base-orange)] rounded-sm cursor-pointer !text-sm text-white flex justify-center items-center" variant="ghost" >شارژ پنل پیامکی</Button>
        </div>
      <PackagesCard />
    </div>
  );
}

export default Index;
export const getServerSideProps = requireRole("packages")();
