import {useState } from "react";
import { cn } from "@/utils/shadcn-utils";
import { Label } from "./label";
import { Button } from "./Button/button";
import { Eye, EyeOff } from "lucide-react";
import type { LabelProp } from "@/types/label";

type InputProps = React.DOMAttributes<HTMLInputElement> & {
    type : "text" | "number" | "file" | "range" | "password" | "email" | "checkbox",
    className ?: string,
    labels ?: LabelProp[],
    value : string | number,
    onChange : (...event: any[]) => void,
    name : string,
    placeholder ?: string,
    min ?: number,
    max ?: number
}



 function Input(
    { className, type = "text", labels, onChange,name,value, ...props } : InputProps & React.PropsWithChildren,
  )
  {
    const [isShowPassword, setIsShowPassword] = useState(false);

    return (
      <>
        {labels?.map(
          (label) =>
            label.position === "before" && (
              <Label key={label.id} {...label}>
                {label.text}
              </Label>
            ),
        )}

        {type == "password" ? (
          <div
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none text-sm md:text-[16px]",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex items-center justify-between",
              className ? className : '',
            )}
          >
            <input
              {...props}
              className="w-full !outline-none"
              type={isShowPassword ? "text" : "password"}
              data-slot="input"
              onChange={onChange}
              name={name}
              value={value}
            />

            <Button
              type="button"
              className="flex items-center justify-center"
              onClick={() => setIsShowPassword((prev) => !prev)}
              size="default"
              variant="ghost"
            >
              {isShowPassword ? (
                <EyeOff className="!w-5 !h-5" />
              ) : (
                <Eye className="!w-5 !h-5" />
              )}
            </Button>
          </div>
        ) : (
          <input
            {...props}
            type={type}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none text-sm md:text-[16px]",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              className ? className : "",
            )}
            onChange={onChange}
            name={name}
            value={value}
          />
        )}

        {labels?.map(
          (label) =>
            label.position === "after" && (
              <Label key={label.id} {...label}>
                {label.text}
              </Label>
            ),
        )}
      </>
    );
  }


export { Input };
