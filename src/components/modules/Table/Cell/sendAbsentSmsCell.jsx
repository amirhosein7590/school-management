import React, { memo } from "react";
import { Button } from "../../Button/button";
import { MessageSquare } from "lucide-react";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { Spinner } from "../../spinner";

function SendAbsentSmsCell({ mutationKey, url }) {
  const { mutate, isPending } = useCustomeMutation(
    mutationKey,
    null,
    url,
    { "content-type": "application/json" },
    "post",
    true
  );
  return (
    <Button
      onClick={() => mutate(null)}
      variant="ghost"
      className="cursor-pointer"
    >
      {isPending ? <Spinner size="sm" /> : <MessageSquare />}
    </Button>
  );
}

export default memo(SendAbsentSmsCell);
