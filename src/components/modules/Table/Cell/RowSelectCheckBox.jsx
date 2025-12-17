import React, { memo, useCallback } from "react";
import useTableStore from "@/store/tableStore";

const RowSelectCheckbox = memo(function RowSelectCheckbox({ rowId, allRowIds = [] }) {
  const isSelected = useTableStore((s) => !!s.selected[rowId]);

  const toggleRowSelected = useTableStore((s) => s.toggleRowSelected);
  const selectRange = useTableStore((s) => s.selectRange);
  const lastSelectedId = useTableStore((s) => s.lastSelectedId);

  const onChange = useCallback(
    (e) => {
      const shift = e.nativeEvent.shiftKey;
      if (shift && lastSelectedId) {
        selectRange(lastSelectedId, rowId, allRowIds);
      } else {
        toggleRowSelected(rowId);
      }

    },
    [lastSelectedId, rowId, allRowIds, selectRange, toggleRowSelected]
  );

  return (
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onChange}
      aria-label={`select-row-${rowId}`}
    />
  );
});

export default RowSelectCheckbox;
