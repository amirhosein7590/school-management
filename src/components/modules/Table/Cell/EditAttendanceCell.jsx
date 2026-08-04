import useCustomeMutation from "@/hooks/useCustomeMutation";
import useTableStore from "@/store/tableStore";
import { CheckCircle } from "lucide-react";
import React, { memo } from "react";
import { Button } from "../../Button/button";
import { Spinner } from "../../spinner";

function EditAttendanceCell({
  row,
  defaultStatus,
  defaultDescription,
  defaultTime,
  defaultDate,
  url,
  deps,
  mutationKey,
  teacherOrStudent = "teacher",
}) {
  const rowState = useTableStore((s) => s.rowState?.[row._id]);
  const { mutate, isPending } = useCustomeMutation(
    mutationKey,
    deps,
    url,
    { "content-type": "application/json" },
    "put",
    true
  );
  const editAttendanceHandler = () => {
    if (teacherOrStudent == "teacher") {
      const { _id, teacher, createdAt, __v, manager, ...otherRowFields } = row;
      mutate({ ...otherRowFields, teacher: teacher?._id, ...rowState });
    } else {
      const { _id, student, createdAt, __v, teacher, ...otherRowFields } = row;
      mutate({ ...otherRowFields, student: student?._id, ...rowState });
    }
  };

  const isRenderEditButton = () => {
    if (rowState) {
      if (rowState?.status && rowState.status != defaultStatus) {
        return true;
      } else if (rowState?.date && rowState.date != defaultDate) {
        return true;
      } else if (rowState?.time && rowState.time != defaultTime) {
        return true;
      } else if (
        rowState?.description &&
        rowState.description != defaultDescription
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      {isRenderEditButton() && (
        <Button
          disabled={isPending || isRenderEditButton() == false}
          className="cursor-pointer"
          onClick={editAttendanceHandler}
          variant="ghost"
          size="sm"
        >
          {isPending ? (
            <Spinner size="sm" />
          ) : (
            <CheckCircle color="var(--dark-blue)" />
          )}
        </Button>
      )}
    </>
  );
}

export default memo(EditAttendanceCell);
