import React, { memo } from "react";
import { Button } from "../../Button/button";
import { Pencil } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import Form from "../../Form";

function EditCell({ id, entityName, user, modalTitle }) {
  const { showModal } = useModal();

  return (
    <Button
      onClick={() =>
        showModal({
          title: modalTitle,
          content: ({ close }) => (
            <Form
              mode="edit"
              size="xl"
              entityId={id}
              entityName={entityName}
              user={user}
              queryOptions={{ paramId: { id } }}
              submitButtonText="ذخیره تغییرات"
              submitButtonClassName="w-full lg:w-auto flex justify-center items-center mt-4"
              afterSubmitFn={close}
              clearFormButton={false}
              datePickerPortal={false}
                            
            />
          ),
        })
      }
      className="cursor-pointer"
      size="sm"
      variant="ghost"
    >
      <Pencil color="var(--dark-blue)" />
    </Button>
  );
}

export default memo(EditCell);
