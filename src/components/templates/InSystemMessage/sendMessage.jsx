import { Button } from "@/components/modules/Button/button";
import { Input } from "@/components/modules/input";
import { Spinner } from "@/components/modules/spinner";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { Send } from "lucide-react";
import React, { memo, useCallback, useState } from "react";

function SendMessage({ receiverId }) {
  const [text, setText] = useState("");
  const { mutate, isPending } = useCustomeMutation(
    "messages",
    null,
    "/messages",
    { "content-type": "application/json" },
    "post",
    true,
  );
  const disableHandler = useCallback(() => {
    return text.length < 1 || isPending ? true : false;
  }, [isPending, receiverId, text]);

  const sendMessageHandler = () => {
    if (disableHandler()) return;
    mutate({ text, receiver: receiverId?.[0] });
  };

  const keyPressHandler = (event) => {
    if (event.code == "Enter") {
      sendMessageHandler();
    }
  };

  return (
    <div className="flex items-center justify-between fixed bottom-2 gap-x-2 w-11/12 z-10">
      <Button
        className="flex items-center justify-center"
        onClick={sendMessageHandler}
        size="sm"
        disabled={disableHandler()}
      >
        {isPending ? (
          <Spinner size="sm" />
        ) : (
          <Send color="white" className="!h-4 !w-4" />
        )}
      </Button>
      <Input
        placeholder="پیام را وارد کنید"
        className="border-0 border-b-1 border-b-gray-300 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-b-gray-500"
        type="text"
        value={text}
        onKeyPress={(event) => keyPressHandler(event)}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}

export default memo(SendMessage);
