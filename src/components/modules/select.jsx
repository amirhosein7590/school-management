import { memo, useMemo, useState } from "react";
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
import { Spinner } from "./spinner";
import useCustomeInfiniteQuery from "@/hooks/useCustomeInfiniteQuery";

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

    const clearSelectedOptions = () => {
      onChange([]);
      setOpen(false);
    };

    const optionsData = !Array.isArray(options)
      ? useCustomeInfiniteQuery(
          options.key,
          options.deps,
          options.url,
          options.headers,
          options.isPrivate
        )
      : undefined;

    const flatData = useMemo(() => {
      if (!optionsData || !optionsData?.data?.pages) return [];
      const arr = optionsData?.data?.pages.flatMap(
        (p) => p?.[options?.dataArrayName] ?? []
      );
      return arr;
    }, [optionsData, options]);

    if (options?.isFetching) {
      return <Spinner size="sm" />;
    }

    const formatedOptions = optionsData?.data?.pages
      ? options.optionsGenerator(flatData)
      : options;

    const getSelectedLabel = () => {
      if (multiple) {
        if (!options || values.length < 1)
          return placeholder || "لطفا انتخاب کنید";
        return `${values.length} مورد انتخاب شد`;
      } else {
        if (!options || values.length < 1)
          return placeholder || "لطفا انتخاب کنید";
        const label = formatedOptions.find(
          (o) => o.value == values?.[0]
        )?.label;
        return label;
      }
    };

    const paginationHandler = () => {
      if (optionsData?.hasNextPage && !optionsData?.isFetching) {
        optionsData?.fetchNextPage();
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
        <div className={`${className} w-64 overflow-auto max-h-50`}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                style={{ direction: "rtl" }}
                className="w-full flex justify-between !rounded-[5px]"
              >
                {getSelectedLabel()}
                <ChevronDown className="opacity-50 w-4 h-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              style={{ direction: "rtl" }}
              className="w-64 p-0 max-h-82.5"
            >
              <Command>
                <CommandInput placeholder="جستجو..." />

                <CommandList>
                  <CommandEmpty>یافت نشد</CommandEmpty>

                  <CommandGroup className="!px-0" heading={title || ""}>
                    {Array.isArray(formatedOptions) &&
                      formatedOptions.map((item) => (
                        <CommandItem
                          className="flex-row-reverse justify-between px-3.5 rounded-none"
                          key={item.value}
                          value={item.label} // for search use label of datas
                          onSelect={() => toggleOption(item.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              values?.includes(item.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}

                    <div className="flex items-center justify-between mt-4">
                      {optionsData?.hasNextPage && (
                        <Button
                          onClick={paginationHandler}
                          disabled={
                            optionsData?.isFetching || !optionsData?.hasNextPage
                          }
                          size="sm"
                          variant="ghost"
                          className="!p-0 !m-0 !text-xs cursor-pointer"
                        >
                          نمایش بیشتر
                        </Button>
                      )}
                      {values.length > 0 && (
                        <Button
                          onClick={clearSelectedOptions}
                          disabled={values.length < 1}
                          size="sm"
                          variant="ghost"
                          className="!p-0 !m-0 !text-xs cursor-pointer text-gray-500"
                        >
                          پاک کردن
                        </Button>
                      )}
                    </div>
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
