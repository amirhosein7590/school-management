import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/utils/shadcn-utils";

export type TClassName = {
    className ?: string
}

const Label = React.memo(({ className, ...props } : React.PropsWithChildren & TClassName) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className ? className : ""
      )}
      {...props}
    />
  );
});

export { Label };
