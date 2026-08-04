import React, { memo, useContext } from "react";
import { Button } from "../../Button/button";
import Form from "../../Form";
import { useModal } from "@/hooks/useModal";
function MessagesChargeCell({ id, entityName, user, modalTitle }) {
  const { showModal } = useModal();
  return (
    <Button
      onClick={() =>
        showModal({
          title: modalTitle,
          content: ({ close }) => (
            <Form
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
      className="cursor-pointer rounded-sm bg-[var(--base-orange)] text-white"
      size="sm"
      variant="ghost"
    >
      شارژ بسته پیامکی
    </Button>
  );
}

export default memo(MessagesChargeCell);
