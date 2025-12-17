import React, { memo } from "react";
import MultiDatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const DatePicker = memo(({ value, onChange, placeholder, size = "md" }) => {
  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const endOfCurrentPersianYear = new DateObject({
    calendar: persian,
    locale: persian_fa,
    year: new DateObject({ calendar: persian }).year,
    month: 12,
    day: 29,
  });
  const iconSizes = {
    sm: "!w-4 !h-4",
    md: "!w-5 !h-5",
    lg: "!w-6 !h-6",
    xl: "!w-7 !h-7",
  };
  const textSizes = {
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
  };

  return (
    <MultiDatePicker
      value={value}
      onChange={(dateObject) => {
        if (dateObject) {
          const formattedDate = dateObject.format("YYYY/MM/DD");
          onChange(formattedDate);
        } else {
          onChange(null);
        }
      }}
      calendar={persian}
      locale={persian_fa}
      format="YYYY/MM/DD"
      placeholder={placeholder || "انتخاب تاریخ"}
      portal={false}
      style={{ direction: value ? "ltr" : "rtl" }}
      weekDays={weekDays}
      maxDate={endOfCurrentPersianYear}
      renderButton={(direction) => {
        return (
          <>
            {direction == "left" ? (
              <ChevronRight size={20} className="cursor-pointer" />
            ) : (
              <ChevronLeft size={20} className="cursor-pointer" />
            )}
          </>
        );
      }}
      render={(value, openCalendar) => {
        return (
          <Button
            type="button"
            variant="outline"
            size={"lg"}
            onClick={openCalendar}
            className="flex items-center gap-2 justify-between w-full"
          >
            <div className="flex items-center gap-x-2">
              <Calendar className={iconSizes[size]} />
              <span
                style={{ fontSize: textSizes[size] }}
                className={value ? "text-foreground" : "text-muted-foreground"}
              >
                {value || placeholder || "انتخاب تاریخ"}
              </span>
            </div>
          </Button>
        );
      }}
    />
  );
});

export default DatePicker;
