import { requireRole } from "@/lib/requireRole";
import React, { memo } from "react";
import SendMessage from "@/components/templates/InSystemMessage/sendMessage";
import ShowMessages from "@/components/templates/InSystemMessage/showMessages";

function InSystemMessage({ user }) {
  return (
    <div dir="rtl" className="px-2 lg:px-4 flex flex-col">
      <SendMessage user={user} />
      <ShowMessages user={user} />
    </div>
  );
}

export default memo(InSystemMessage);

export const getServerSideProps = requireRole("inSystemMessage")();
