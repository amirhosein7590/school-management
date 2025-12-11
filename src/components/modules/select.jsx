"use client";

import { memo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/shadcn-utils";
import { Button } from "@/components/modules/button";
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

const Select = memo(
  ({
    options = [],
    values = [],
    multiple = false,
    title,
    onChange = () => {},
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

    return (
      <div className="m-10 w-64">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              style={{ direction: "rtl" }}
              className="w-full flex justify-between"
            >
              {values.length === 0
                ? "لطفا انتخاب کنید"
                : `${values.length} مورد انتخاب شد`}
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
    );
  }
);

export default Select;
