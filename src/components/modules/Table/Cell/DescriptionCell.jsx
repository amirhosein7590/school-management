import React, { memo, useState } from "react";
import useTableStore from "@/store/tableStore";
import { Button } from "@/components/modules/Button/button";
import { useModal } from "@/contexts/ModalContext";
import { Input } from "../../input";
import { Edit } from "lucide-react";

const DescriptionCell = memo(function DescriptionCell({ rowId }) {
  const setRowState = useTableStore((s) => s.setRowState);
  const rowState = useTableStore((s) => s.rowState[rowId]);
  const { showModal } = useModal();
  const showModalHandler = () => {
    showModal({
      title: "انتخاب توضیح",
      content: ({ close }) => {
        const [input, setInput] = useState(rowState.descriptionValue || "");
        return (
          <div>
            <Input value={input} defaultValue="sadada" onChange={setInput} />
            <Button
              onClick={() => {
                setRowState(rowId, { descriptionValue: input });
                close();
              }}
            >
              ثبت توضیح
            </Button>
          </div>
        );
      },
    });
  };

  if (!["late", "other", "excused"].includes(rowState?.status)) return null;

  return (
    <div className="flex justify-center items-center gap-x-2">
      <Button
        onClick={showModalHandler}
        size="sm"
        className="!p-0"
        variant="ghost"
      >
        <Edit />
      </Button>
      {rowState?.descriptionValue && (
        <span className="truncate w-15">{rowState.descriptionValue}</span>
      )}
    </div>
  );
});

export default DescriptionCell;
