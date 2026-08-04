import React, { memo, useContext } from "react";
import { Button } from "../../Button/button";
import { Pencil } from "lucide-react";
import Form from "../../Form";
import { useModal } from "@/hooks/useModal";

function EditCell({ id, entityName, user, modalTitle }) {
  const { showModal } = useModal();
  return (
    <Button
      onClick={() =>
        showModal({
          title: modalTitle,
          content: ({ closeModal, id: modalId }) => (
            <Form
              mode="edit"
              size="xl"
              entityId={id}
              entityName={entityName}
              user={user}
              queryOptions={{ paramId: { id } }}
              submitButtonText="ذخیره تغییرات"
              submitButtonClassName="w-full lg:w-auto flex justify-center items-center mt-4"
              afterSubmitFn={() => closeModal(modalId)}
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
