import React, { memo } from "react";
import MultiDatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Button } from "./Button/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import useTableStore from "@/store/tableStore";

const DatePicker = memo(
  ({
    value,
    onChange,
    placeholder,
    size = "md",
    name,
    onBlur,
    className,
    mode,
    rowId,
    datePickerPortal = true,
  }) => {
    const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

    const todayPersian = new DateObject({
      date: new Date(),
      calendar: persian,
      locale: persian_fa,
    });

    const minPersianDate = new DateObject({
      calendar: persian,
      locale: persian_fa,
      year: 1310,
      month: 1,
      day: 1,
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

    const getDateObjectValue = (v) => {
      if (!v) return null;
      if (v instanceof DateObject) return v;

      if (typeof v === "string" && v.includes("T")) {
        const d = new Date(v); // create native date from ISO
        if (isNaN(d)) return null;
        return new DateObject({
          date: d,
          calendar: persian,
          locale: persian_fa,
        });
      }

      try {
        return new DateObject({
          date: v,
          calendar: persian,
          locale: persian_fa,
          format: "YYYY/MM/DD",
        });
      } catch (e) {
        const d2 = new Date(v);
        if (!isNaN(d2)) {
          return new DateObject({
            date: d2,
            calendar: persian,
            locale: persian_fa,
          });
        }
        return null;
      }
    };

    const setRowState = useTableStore((s) => s.setRowState);
    const rowState = useTableStore((s) => s.rowState[rowId]);

    const showPlaceholderHandler = () => {
      if (mode == "attendance") {
        if (rowState?.date) return rowState?.date;
        else return placeholder;
      } else {
        return placeholder || "انتخاب تاریخ";
      }
    };

    const currentDate = getDateObjectValue(value) || todayPersian;

    const displayValue = (v) => {
      if (!v) return null;
      if (v instanceof DateObject) return v.format("YYYY/MM/DD");
      const dobj = getDateObjectValue(v);
      return dobj ? dobj.format("YYYY/MM/DD") : String(v);
    };

    return (
      <MultiDatePicker
        value={getDateObjectValue(value)}
        onChange={(dateObject) => {
          if (mode == "attendance") {
            if (!dateObject) {
              setRowState(rowId, { date: null });
            }
            const isoDate = dateObject.toDate().toISOString().slice(0, 10);
            setRowState(rowId, { date: isoDate });
          } else {
            if (!dateObject) {
              onChange(null);
              if (typeof onBlur === "function") onBlur();
              return;
            }
            const isoDate = dateObject.toDate().toISOString();
            onChange(isoDate);

            if (typeof onBlur === "function") onBlur();
          }
        }}
        calendar={persian}
        locale={persian_fa}
        format="YYYY/MM/DD"
        placeholder={showPlaceholderHandler()}
        portal={!!datePickerPortal}
        weekDays={weekDays}
        minDate={minPersianDate}
        maxDate={todayPersian}
        currentDate={currentDate}
        className="relative z-100"
        renderButton={(direction, onClick) => {
          return (
            <button
              type="button"
              onClick={onClick}
              className="cursor-pointer bg-transparent border-0 p-1"
            >
              {direction === "left" ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          );
        }}
        render={(v, openCalendar) => {
          return (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                openCalendar();
              }}
              className={`flex items-center gap-2 justify-between w-full ${className}`}
            >
              <div className="flex justify-between items-center w-full gap-x-2">
                <Calendar className={iconSizes[size]} />
                <span
                  style={{ fontSize: textSizes[size] }}
                  className={v ? "text-foreground" : "text-muted-foreground"}
                >
                  {displayValue(v) || placeholder || "انتخاب تاریخ"}
                </span>
              </div>
            </Button>
          );
        }}
      />
    );
  }
);

export default DatePicker;
