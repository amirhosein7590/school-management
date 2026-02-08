import React, { memo } from "react";
import useTableStore from "@/store/tableStore";
import { Button } from "@/components/modules/Button/button";
import TimePicker from "../../timePicker";

const TimeCell = memo(function TimeCell({ rowId, defaultStatus, defaultTime }) {
  const rowState = useTableStore((s) => s.rowState[rowId]);
  const setRowState = useTableStore((s) => s.setRowState);
  if (rowState?.status !== "late" && defaultStatus !== "late") return null;

  return (
    <div className="flex items-center justify-center gap-x-2">
      <TimePicker
        defaultTime={defaultTime}
        onClose={({ hour, minute }) =>
          setRowState(rowId, { time: `${hour}:${minute}` })
        }
      />
    </div>
  );
});

export default TimeCell;
