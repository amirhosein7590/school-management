"use client";

import { memo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/shadcn-utils";
import { Button } from "@/components/modules/Button/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
  CommandEmpty,
} from "@/components/modules/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modules/popover";
import { Label } from "./label";

const Select = memo(
  ({
    options = [],
    values = [],
    multiple = false,
    title,
    onChange = () => {},
    labels,
    className,
    placeholder,
  }) => {
    const [open, setOpen] = useState(false);

    const toggleOption = (value) => {
      if (multiple) {
        if (values.includes(value)) {
          onChange(values.filter((v) => v !== value));
        } else {
          onChange([...values, value]);
        }
      } else {
        onChange([value]);
        setOpen(false);
      }
    };

    const getSelectedLabel = () => {
      if (multiple) {
        if (!options || values.length < 1)
          return placeholder || "لطفا انتخاب کنید";
        return `${values.length} مورد انتخاب شد`;
      } else {
        if (!options || values.length < 1)
          return placeholder || "لطفا انتخاب کنید";
        const label = options.find((o) => o.value == values[0]).label;
        return label;
      }
    };

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
        <div className={`${className} w-64`}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                style={{ direction: "rtl" }}
                className="w-full flex justify-between"
              >
                {getSelectedLabel()}
                <ChevronDown className="opacity-50 w-4 h-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent style={{ direction: "rtl" }} className="w-64 p-0">
              <Command>
                <CommandInput placeholder="جستجو..." />

                <CommandList>
                  <CommandEmpty>یافت نشد</CommandEmpty>

                  <CommandGroup heading={title || ""}>
                    {options.map((item) => (
                      <CommandItem
                        className="flex-row-reverse justify-between"
                        key={item.value}
                        value={item.label} // for search use label of datas
                        onSelect={() => toggleOption(item.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            values.includes(item.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
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

export default Select;
