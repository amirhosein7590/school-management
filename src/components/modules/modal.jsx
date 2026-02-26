import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/modules/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { memo } from "react";

function ModalComponent({ modal, close, update }) {
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      close();
    }
  };

  const {
    id,
    parentId,
    title,
    size,
    data,
    content: Content,
    header: Header,
  } = modal;

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className={sizeClasses(size)}>
        <DialogHeader
          className="!justify-between !flex-row !items-center"
          style={{ direction: "ltr" }}
        >
          {Header && <Header />}
          <DialogTitle className="!mr-10">{title}</DialogTitle>
        </DialogHeader>

        {Content && (
          <Content
            data={data}
            id={id}
            parentId={parentId}
            close={(result) => close(result)}
            update={update}
            openNested={(cfg) =>
              modal.showModal({ ...cfg, parentId: modal.id })
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

const ModalContainer = memo(ModalComponent, (prev, next) => {
  const { modal: prevModal, close: prevClose, update: prevUpdate } = prev;
  const { modal: nextModal, close: nextClose, update: nextUpdate } = next;

  return (
    prevModal.id === nextModal.id &&
    prevModal.data === nextModal.data &&
    prevModal.title === nextModal.title &&
    prevModal.size === nextModal.size &&
    prevModal.content === nextModal.content &&
    prevModal.onClose === nextModal.onClose &&
    prevClose === nextClose &&
    prevUpdate === nextUpdate
  );
});

const sizeClasses = (size) => {
  switch (size) {
    case "sm":
      return "!max-w-sm";
    case "lg":
      return "!max-w-3xl";
    case "xl":
      return "!max-w-5xl";
    case "2xl":
      return "lg:!max-w-7xl";
    default:
      return "!max-w-xl";
  }
};

export { ModalContainer };
