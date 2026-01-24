import React, { memo } from "react";
import { Button } from "../../Button/button";
import { Trash2 } from "lucide-react";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { useModal } from "@/contexts/ModalContext";
import { Spinner } from "../../spinner";

function DeleteCell({
  id,
  url,
  mutationKey,
  entityName,
  dataArrayName,
  className,
}) {
  const { mutateAsync, isPending } = useCustomeMutation(
    mutationKey,
    null,
    `${url}/${id}`,
    null,
    "delete",
    true,
    dataArrayName
  );
  const { showModal } = useModal();
  const deleteEntity = async (close) => {
    await mutateAsync(null);
    close();
  };
  return (
    <Button
      className={`cursor-pointer ${className}`}
      onClick={() =>
        showModal({
          size: "sm",
          content: ({ close }) => (
            <div className="flex flex-col">
              <p className="title text-center sans-bold text-lg">
                حذف {entityName}
              </p>
              <p className="description text-gray-500 my-5 text-sm text-center">
                این عملیات غیر قابل بازگشت است ، آیا از انجام این عملیات اطمینان
                دارید ؟
              </p>
              <div className="buttons-container flex items-center justify-center gap-x-2">
                <Button
                  onClick={close}
                  variant="secondary"
                  className="text-center cursor-pointer w-1/2 flex justify-center items-center"
                >
                  انصراف
                </Button>
                <Button
                  size="sm"
                  onClick={() => deleteEntity(close)}
                  variant="destructive"
                  className={`text-center w-1/2 flex justify-center items-center ${
                    isPending ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {isPending ? <Spinner size="sm" /> : "حذف"}
                </Button>
              </div>
            </div>
          ),
        })
      }
      size="sm"
      variant="ghost"
    >
      <Trash2 color="red" />
    </Button>
  );
}

export default memo(DeleteCell);
