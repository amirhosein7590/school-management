import React from "react";

function MessageItem({
  receiverId,
  isYouSend,
  text,
  createdAt,
  receiver,
  sender,
}) {
  const date = new Date(createdAt);
  const time = date.toLocaleString("FA").slice(10,-3)
  return (
    <div
      className={`flex flex-col rounded-sm py-2 px-4 ${
        isYouSend ? "message-item-sent" : "message-item-received"
      }`}
    >
      {text}
      <span className="text-xs mt-1 text-white">{time}</span>
    </div>
  );
}

export default MessageItem;
