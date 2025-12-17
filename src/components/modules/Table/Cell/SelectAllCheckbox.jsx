// components/modules/Table/Cell/SelectAllCheckbox.jsx
import React, { memo, useMemo } from "react";
import useTableStore from "@/store/tableStore";

const SelectAllCheckbox = memo(function SelectAllCheckbox({ allRowIds = [] }) {
  const selector = useMemo(
    () => (s) => {
      if (!allRowIds || allRowIds.length === 0) return false;
      // for (const id of allRowIds) {
      //   if (!s.selected[id]) return false;
      // }
      // return true;
      return allRowIds.every((id) => s.selected[id]);
    },
    [allRowIds]
  );

  const allSelected = useTableStore(selector);
  const selectAll = useTableStore((s) => s.selectAll);
  const clearSelection = useTableStore((s) => s.clearSelection);

  const onChange = () => {
    if (allSelected) clearSelection();
    else selectAll(allRowIds);
  };

  return (
    <input
      type="checkbox"
      checked={allSelected}
      onChange={onChange}
      aria-label="select-all"
    />
  );
});

export default SelectAllCheckbox;
