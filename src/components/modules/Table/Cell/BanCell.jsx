import useCustomeMutation from "@/hooks/useCustomeMutation";
import React, { memo } from "react";
import { Spinner } from "../../spinner";
import { Button } from "../../Button/button";

function BanCell({ user, id, isBanned, entityName }) {
  const roleNames = {
    manager: "مدیر",
    teacher: "معلم",
  };

  const { mutate, isPending } = useCustomeMutation(
    entityName,
    null,
    `/${entityName}/${id}/ban`,
    { "content-type": "application/json" },
    "post",
    true
  );

  const toggleBanHandler = () => {
    mutate({ isBanned: !isBanned });
  };
  return (
    <Button
      variant="ghost"
      onClick={toggleBanHandler}
      size="sm"
      className="bg-blue-900 text-white !rounded-[7px] cursor-pointer"
    >
      {isPending ? <Spinner size="sm" /> : isBanned ? "رفع مسدودیت" : "مسدودیت"}
    </Button>
  );
}

export default memo(BanCell);
