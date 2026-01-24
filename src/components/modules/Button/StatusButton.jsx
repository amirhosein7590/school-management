import React, { memo, useCallback, useEffect, useState } from "react";
import useTableStore from "@/store/tableStore";
import { Button } from "./button";
const StatusButtons = memo(function StatusButtons({
  rowId,
  defaultStatus,
  className,
}) {
  const setRowState = useTableStore((s) => s.setRowState);
  const [status, setStatus] = useState(defaultStatus);

  const statusColors = {
    present: "!bg-green-200 !text-green-600",
    absent: "!bg-red-200 !text-red-600",
    excused: "!bg-orange-200 !text-orange-600",
    late: "!bg-blue-200 !text-blue-600",
    other: "!bg-yellow-200 !text-yellow-600",
  };

  const changeColorHandler = (st) =>
    st == status ? statusColors[st] : "!text-black !bg-[#f5f5f5]";

  const makeHandler = ({ status }) => {
    setRowState(rowId, { status });
    setStatus(status);
  };

  return (
    <div className={className ?? "flex justify-center items-center"}>
      <Button
        size="sm"
        variant="ghost"
        className={`!border !border-[#0000001f] !rounded-tr-[5px] !rounded-br-[5px] ${changeColorHandler(
          "present"
        )} rounded-none`}
        onClick={() => makeHandler({ status: "present" })}
      >
        حاضر
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={`!border !border-[#0000001f] !border-r-0 ${changeColorHandler(
          "absent"
        )} rounded-none`}
        onClick={() => makeHandler({ status: "absent", value: null })}
      >
        غیبت
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={`!border !border-[#0000001f] !border-r-0 ${changeColorHandler(
          "excused"
        )} rounded-none`}
        onClick={() => makeHandler({ status: "excused" })}
      >
        غیبت موجه
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={`!border !border-[#0000001f] !border-r-0 ${changeColorHandler(
          "late"
        )} rounded-none`}
        onClick={() => makeHandler({ status: "late" })}
      >
        تاخیر
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={`!border !border-[#0000001f] !border-r-0 !rounded-tl-[5px] !rounded-bl-[5px] ${changeColorHandler(
          "other"
        )} rounded-none`}
        onClick={() => makeHandler({ status: "other" })}
      >
        سایر
      </Button>
    </div>
  );
});

export default StatusButtons;
