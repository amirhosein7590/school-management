import React, { useCallback } from "react";
import useTableStore from "@/store/tableStore";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { Button } from "./button";
import { Spinner } from "../spinner";

function SelectAction({ registry }) {
  const selected = useTableStore((s) => s.selected);
  const selectAll = useTableStore((s) => s.selectAll);
  const { mutateAsync, isPending } = useCustomeMutation(
    registry.key,
    null,
    `${registry.url}/deleteMany`,
    { "content-type": "application/json" },
    "post",
    true
  );

  const selectedRows = React.useMemo(
    () => Object.keys(selected).filter((id) => !!id),
    [selected]
  );

  const handleDelete = useCallback(async () => {
    if (!selectedRows || selectedRows.length === 0) return;
    await mutateAsync({ ids: selectedRows });
    selectAll([]);
  }, [mutateAsync, selectedRows]);

  if (selectedRows.length < 2) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      className={`${
        isPending || selectedRows.length === 0
          ? "cursor-not-allowed"
          : "cursor-pointer"
      }`}
      onClick={handleDelete}
      disabled={isPending || selectedRows.length === 0}
    >
      {isPending ? <Spinner /> : "حذف انتخاب‌شده‌ها"}
    </Button>
  );
}

export default React.memo(SelectAction);
