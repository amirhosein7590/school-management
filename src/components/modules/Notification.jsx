import React from "react";
import { Button } from "./Button/button";
import { Trash } from "lucide-react";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { useQueryClient } from "@tanstack/react-query";

const notifColors = {
  info: "bg-blue-500",
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
};

function Notification({ text, status = "info", _id }) {
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending } = useCustomeMutation(
    "deleteNotification",
    null,
    `/notifications/:id`,
    null,
    "delete",
    true
  );

  const deleteNotif = (notifId) => {
    deleteMutate(null, {
      paramId: { id: notifId },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
    });
  };
  return (
    <div className="relative flex my-2 items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-3 shadow-sm transition hover:bg-gray-50 sm:px-4">
      {/* status bar */}
      <span
        className={`absolute right-0 top-0 h-full w-2 rounded-r-lg ${notifColors[status]}`}
        aria-hidden
      />

      {/* text */}
      <p className="flex-1 min-w-0 text-sm text-gray-800 break-words leading-relaxed pr-6 sm:pr-8">
        {text}
      </p>

      {/* actions */}
      <Button
        variant="ghost"
        className="p-1.5 sm:p-2 text-red-600 flex-shrink-0 self-start"
        aria-label="حذف اعلان"
        onClick={() => deleteNotif(_id)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default Notification;
