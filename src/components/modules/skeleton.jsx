import { cn } from "@/utils/shadcn-utils";
import { memo } from "react";

const Skeleton = memo(({ className, ...props }) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
});

export { Skeleton };
