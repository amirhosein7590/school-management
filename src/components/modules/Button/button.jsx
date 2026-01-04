import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/utils/shadcn-utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const buttonVariants = cva(
  "inline-flex gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--light-blue)] border border-[var(--light-blue)] text-white hover:bg-[var(--dark-blue)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "",
        // "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 py-1 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-15 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const WithTooltip = React.memo(({ tooltip, children }) => {
  if (!tooltip) return children;

  return (
    <div className="relative inline-flex group">
      {children}

      <span
        className="
          pointer-events-none
          absolute top-full left-1/2 z-50
          mt-1 -translate-x-1/2
          hidden group-hover:block
          rounded-sm bg-gray-500 px-3 py-2
          text-sm text-white text-center
          max-w-xs break-words text-nowrap
          animate-in fade-in-0 zoom-in-95
        "
      >
        {tooltip}
      </span>
    </div>
  );
});

const Button = React.memo(
  ({
    className,
    variant,
    size,
    asChild = false,
    href = null,
    isActiveAware = false,
    tooltip = null,
    activeClass,
    disabled,
    ...props
  }) => {
    const Comp = asChild ? Slot : "button";
    const pathName = usePathname();
    const isActive = href ? pathName?.startsWith(href) : false;

    if (isActiveAware) {
      const activeCls = isActive && "bg-gray-100";
      return (
        <WithTooltip tooltip={tooltip}>
          <Link
            className={cn(
              buttonVariants({ variant, size }),
              isActive && activeCls,
              disabled
                ? "!text-[rgba(0,0,0,.26)] bg-[rgba(0,0,0,.12)] !cursor-not-allowed !border-[rgba(0,0,0,.12)] hover:!bg-[rgba(0,0,0,.12)]"
                : "",
              className
            )}
            href={href}
            {...props}
          />
        </WithTooltip>
      );
    }

    if (href) {
      return (
        <WithTooltip tooltip={tooltip}>
          <Link
            className={cn(
              buttonVariants({ variant, size }),
              disabled
                ? "!text-[rgba(0,0,0,.26)] bg-[rgba(0,0,0,.12)] !cursor-not-allowed !border-[rgba(0,0,0,.12)] hover:!bg-[rgba(0,0,0,.12)]"
                : "",
              className
            )}
            href={href}
            {...props}
          />
        </WithTooltip>
      );
    }

    return (
      <WithTooltip tooltip={tooltip}>
        <Comp
          data-slot="button"
          className={cn(
            buttonVariants({ variant, size }),
            isActiveAware && isActive && "!text-red-600",
            disabled
              ? "!text-[rgba(0,0,0,.26)] bg-[rgba(0,0,0,.12)] !cursor-not-allowed !border-[rgba(0,0,0,.12)] hover:!bg-[rgba(0,0,0,.12)]"
              : "",
            className
          )}
          {...props}
        />
      </WithTooltip>
    );
  }
);

export { Button, buttonVariants };
