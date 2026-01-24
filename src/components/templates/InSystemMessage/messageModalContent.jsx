import useCustomeInfiniteQuery from "@/hooks/useCustomeInfiniteQuery";
import useCustomeQuery from "@/hooks/useCustomeQuery";
import React, { useCallback, useMemo } from "react";
import SendMessage from "./sendMessage";
import MessagesList from "./messagesList";

function MessageModalContent({ receiverId, close }) {
  const { data: receiverInfo, isPending: recevierLoading } = useCustomeQuery(
    "getReceiver",
    null,
    `/messages/${receiverId}/getReceiver`,
    null,
    true,
    {},
  );

  const receiverFullName = useCallback(() => {
    return `${receiverInfo?.receiver?.firstName ?? ""} ${
      receiverInfo?.receiver?.lastName ?? ""
    }`;
  }, [receiverInfo, recevierLoading]);

  return (
    <div dir="rtl" className="flex flex-col relative h-100 lg:h-150">
      <div className="title text-sm">مخاطب : {receiverFullName()}</div>
      <SendMessage receiverId={receiverId} />
      <MessagesList receiverId={receiverId} />
    </div>
  );
}

export default MessageModalContent;
