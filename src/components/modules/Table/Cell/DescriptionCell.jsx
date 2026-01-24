import React, { memo, useCallback, useEffect, useState } from "react";
import useTableStore from "@/store/tableStore";
import { Button } from "@/components/modules/Button/button";
import { useModal } from "@/contexts/ModalContext";
import { Input } from "../../input";
import { Edit } from "lucide-react";
import useCustomeQuery from "@/hooks/useCustomeQuery";
import { Spinner } from "../../spinner";

const DescriptionCell = memo(function DescriptionCell({
  rowId,
  defaultStatus,
  defaultValue,
  mode = "edit",
}) {
  const setRowState = useTableStore((s) => s.setRowState);
  const rowState = useTableStore((s) => s.rowState?.[rowId]);
  const { showModal } = useModal();
  const showModalHandler = () => {
    showModal({
      title: "انتخاب توضیح",
      content: ({ close }) => {
        const [input, setInput] = useState(
          rowState?.description || defaultValue || ""
        );
        return (
          <div dir="rtl" className="flex flex-col">
            {mode == "edit" ? (
              <>
                {" "}
                <textarea
                  className="py-2 px-4 border-2 rounded-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button
                  size="sm"
                  className="mt-5 !rounded-sm cursor-pointer w-full flex justify-center items-center lg:w-25"
                  onClick={() => {
                    setRowState(rowId, { description: input });
                    close();
                  }}
                >
                  ثبت توضیح
                </Button>
              </>
            ) : (
              <span>{defaultValue}</span>
            )}
          </div>
        );
      },
    });
  };

  const isValidStatus = () =>
    ["late", "excused", "other"].includes(rowState?.status || defaultStatus);

  if (!isValidStatus()) return null;

  return (
    <div className="flex justify-center items-center gap-x-2">
      <Button
        onClick={showModalHandler}
        size="sm"
        className="!p-0 !m-0 flex justify-center items-center"
        variant="ghost"
      >
        <Edit />
      </Button>
    </div>
  );
});

export default DescriptionCell;
