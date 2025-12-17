import React, { memo, useCallback } from "react";
import useTableStore from "@/store/tableStore";
import { Button } from "./button";
const StatusButtons = memo(function StatusButtons({ rowId, className }) {
  const rowState = useTableStore((s) => s.rowState[rowId]);
  const setRowState = useTableStore((s) => s.setRowState);

  const makeHandler = useCallback(
    (value) => () => setRowState(rowId, value),
    [rowId, setRowState]
  );

  return (
    <div className={className ?? "flex justify-center items-center"}>
      <Button
        size="sm"
        className={`!border !border-[#0000001f] ${
          rowState?.status == "present"
            ? "!bg-green-200 !text-green-600"
            : "!text-black !bg-[#f5f5f5]"
        } rounded-none`}
        onClick={makeHandler({ status: "present", value: null })}
      >
        حاضر
      </Button>
      <Button
        size="sm"
        className={`!border !border-[#0000001f] !border-r-0 ${
          rowState?.status == "absent"
            ? "!bg-red-200 !text-red-600"
            : "!text-black !bg-[#f5f5f5]"
        } rounded-none`}
        onClick={makeHandler({ status: "absent", value: null })}
      >
        غیبت
      </Button>
      <Button
        size="sm"
        className={`!border !border-[#0000001f] !border-r-0 ${
          rowState?.status == "excused"
            ? "!bg-orange-200 !text-orange-600"
            : "!text-black !bg-[#f5f5f5]"
        } rounded-none`}
        onClick={makeHandler({ status: "excused" })}
      >
        غیبت موجه
      </Button>
      <Button
        size="sm"
        className={`!border !border-[#0000001f] !border-r-0 ${
          rowState?.status == "late"
            ? "!bg-blue-200 !text-blue-600"
            : "!text-black !bg-[#f5f5f5]"
        } rounded-none`}
        onClick={makeHandler({ status: "late" })}
      >
        تاخیر
      </Button>
      <Button
        size="sm"
        className={`!border !border-[#0000001f] !border-r-0 ${
          rowState?.status == "other"
            ? "!bg-yellow-200 !text-yellow-600"
            : "!text-black !bg-[#f5f5f5]"
        } rounded-none`}
        onClick={makeHandler({ status: "other" })}
      >
        سایر
      </Button>
    </div>
  );
});

export default StatusButtons;
