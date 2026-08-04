import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/utils/shadcn-utils";

type TClassName = {className ?: string}
type TStyle = {style ?: React.CSSProperties}
type TDialogProps = DialogPrimitive.DialogProps & TClassName
type TDilogContent = React.PropsWithChildren & {showCloseButton ?: boolean} & TClassName
type TDialogOverlay = React.PropsWithChildren & TClassName

const Dialog = React.memo(({ ...props } : TDialogProps) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
});

const DialogTrigger = React.memo(({ ...props } : React.PropsWithChildren) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
});

const DialogPortal = React.memo(({ ...props } : React.PropsWithChildren) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
});

const DialogClose = React.memo(({ ...props } : React.PropsWithChildren) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
});

const DialogOverlay = React.memo(({ className, ...props }:TDialogOverlay) => {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className ? className : ""
      )}
      {...props}
    />
  );
});

const DialogContent = React.memo(
  ({ className, children, showCloseButton = true, ...props } : TDilogContent) => {
    return (
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            className ? className : ""
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }
);

const DialogHeader = React.memo(({ className, ...props } : React.PropsWithChildren & TStyle & TClassName) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className ? className : "")}
      {...props}
    />
  );
});

const DialogFooter = React.memo(({ className, ...props }:React.PropsWithChildren & TClassName) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className ? className : ""
      )}
      {...props}
    />
  );
});

const DialogTitle = React.memo(({ className, ...props }:React.PropsWithChildren & TClassName) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className ? className : "")}
      {...props}
    />
  );
});

const DialogDescription = React.memo(({ className, ...props }:React.PropsWithChildren & TClassName) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className ? className : "")}
      {...props}
    />
  );
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
