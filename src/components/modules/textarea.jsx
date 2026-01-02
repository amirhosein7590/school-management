import * as React from "react";

import { cn } from "@/utils/shadcn-utils";
import { Label } from "./label";

const Textarea = React.memo(
  ({ className, value, onChange, name, placeholder, labels, ...props }) => {
    return (
      <>
        {labels?.length > 0 &&
          labels.map((label) => (
            <>
              {label.position == "before" && (
                <Label key={label.id} {...label}>
                  {label.text}
                </Label>
              )}
            </>
          ))}
        <textarea
          data-slot="textarea"
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          name={name}
          placeholder={placeholder}
          {...props}
        />
        {labels?.length > 0 &&
          labels.map((label) => (
            <>
              {label.position == "after" && (
                <Label key={label.id} {...label}>
                  {label.text}
                </Label>
              )}
            </>
          ))}
      </>
    );
  }
);

export { Textarea };
