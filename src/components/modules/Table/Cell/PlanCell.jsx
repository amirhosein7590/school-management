import React, { memo } from "react";
import { Button } from "../../Button/button";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { Spinner } from "../../spinner";

function PlanCell({ managerId }) {
  const { mutate, isPending } = useCustomeMutation(
    "managers",
    null,
    `/managers/${managerId}/planRenewal`,
    { "content-type": "application/json" },
    "post",
    true,
  );
  return (
    <Button
      onClick={() => mutate(null)}
      size="sm"
      className="text-white !rounded-[7px] cursor-pointer"
    >
      {isPending ? <Spinner size="sm" /> : "تمدید پلن"}
    </Button>
  );
}

export default memo(PlanCell);
