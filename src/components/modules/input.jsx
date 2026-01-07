import { memo, forwardRef } from "react";
import { cn } from "@/utils/shadcn-utils";
import { Label } from "./label";

const Input = memo(
  forwardRef(function Input(
    { className, type = "text", labels, onChange, ...props },
    ref
  ) {
    return (
      <>
        {labels?.map(
          (label) =>
            label.position === "before" && (
              <Label key={label.id} {...label}>
                {label.text}
              </Label>
            )
        )}

        <input
          {...props}
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none text-sm md:text-[16px]",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          onChange={onChange}
        />

        {labels?.map(
          (label) =>
            label.position === "after" && (
              <Label key={label.id} {...label}>
                {label.text}
              </Label>
            )
        )}
      </>
    );
  })
);

export { Input };
