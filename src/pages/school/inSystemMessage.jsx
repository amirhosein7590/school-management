import { requireRole } from "@/lib/requireRole";
import React, { memo } from "react";
import SendMessage from "@/components/templates/InSystemMessage/sendMessage";

function InSystemMessage({ user }) {
  return (
    <div dir="rtl" className="px-4 flex flex-col">
      <SendMessage user={user} />
    </div>
  );
}

export default memo(InSystemMessage);

export const getServerSideProps = requireRole("inSystemMessage")();
