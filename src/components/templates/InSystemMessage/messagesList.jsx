import MessageItem from "@/components/modules/messageItem";
import { Spinner } from "@/components/modules/spinner";
import useCustomeInfiniteQuery from "@/hooks/useCustomeInfiniteQuery";
import React, { memo, useEffect, useMemo, useRef } from "react";

function MessagesList({ receiverId }) {
  const {
    data: pages,
    isPending: messagesLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useCustomeInfiniteQuery(
    "messages",
    null,
    `/messages?receiver=${receiverId}`,
    null,
    true
  );

  const flatData = useMemo(() => {
    if (!pages || !pages.pages) return [];
    const arr = pages.pages.flatMap((p) => p?.messages ?? []);
    return arr;
  }, [pages]);

  const observerRef = useRef();

  const getPersianDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col mt-4 overflow-auto">
      {messagesLoading && <Spinner size="lg" />}

      {!messagesLoading && flatData?.length < 1 && (
        <span className="w-full h-100 lg:h-150 flex items-center justify-center">
          هیچ پیامی موجود نیست
        </span>
      )}
      {flatData?.map((message, index) => {
        const currentDate = getPersianDate(message.createdAt);
        const prevDate =
          index > 0 ? getPersianDate(flatData[index - 1].createdAt) : null;

        const shouldShowDate = index === 0 || currentDate !== prevDate;

        return (
          <React.Fragment key={message._id}>
            {shouldShowDate && (
              <div className="flex justify-center my-4">
                <span className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600">
                  {currentDate}
                </span>
              </div>
            )}

            <div
              className={`message-item-container flex my-2 ${
                message.isYouSend ? "justify-start" : "justify-end"
              }`}
            >
              <MessageItem receiverId={receiverId} {...message} />
            </div>
          </React.Fragment>
        );
      })}

      <div className="w-[1px] h-[1px] opacity-0" ref={observerRef}></div>
    </div>
  );
}

export default memo(MessagesList);
