'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/modules/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { memo } from "react";
import type {Modal , Size, closeModal , updateData} from "@/types/providers/modal"

type ModalProps = {
    modal : Modal,
    close : closeModal,
    update : updateData
}

function ModalComponent({ modal, close, update } : ModalProps) {
  const handleOpenChange = (isOpen : boolean) => {
    if (!isOpen) {
      close(modal?.id ? modal.id : Math.random() * 1000);
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
      <DialogContent className={sizeClasses(size ? size : "sm")}>
        <DialogHeader
          className="!justify-between !flex-row !items-center"
          style={{ direction: "ltr" }}
        >
          {typeof Header == "function" ? <Header /> : Header}
          <DialogTitle className="!mr-10">{title}</DialogTitle>
        </DialogHeader>

        {typeof Content == "function" ? <Content
           title={title}
           size={size}
           closeModal={close}
           updateData={update}
           id={id ? id : Math.random() * 1000}
           data={data}
           openNested={modal.showModal}
          /> : Content}
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

const sizeClasses = (size : Size) => {
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
