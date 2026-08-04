import { Loader2Icon } from "lucide-react";

import { cn } from "@/utils/shadcn-utils";
import { memo } from "react";

type SpinnerProp = React.PropsWithChildren & {
    className ?: string,
    size : "xs" | "sm" | "md" | "lg" | "xl",
}

const Spinner = memo(({ className, size, ...props } : SpinnerProp) => {
  const sizes = {
    xs : "size2",
    sm: "size4",
    md: "size-7",
    lg: "size-10",
    xl: "size-15",
  };
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(`${sizes[size]} animate-spin ${className}`)}
      {...props}
    />
  );
});

export { Spinner };
