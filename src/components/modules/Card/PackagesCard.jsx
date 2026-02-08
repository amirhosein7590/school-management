import useCustomeQuery from "@/hooks/useCustomeQuery";
import React, { useCallback } from "react";
import { Spinner } from "../spinner";
import dateToSolar from "@/utils/dateToSolar";
import persianJs from "persianjs";

function PackagesCard() {
  const { data, isPending } = useCustomeQuery(
    "me",
    null,
    "/auth/me",
    null,
    true,
  );

  const activateTimeHandler = useCallback(() => {
    const { expTime, plan } = data?.user || {};

    if (!expTime || !plan) return <Spinner size="sm" />;

    const planTime =
      plan == "free"
        ? process.env.NEXT_PUBLIC_FREE_PLAN_TIME
        : process.env.NEXT_PUBLIC_CASHE_PLAN_TIME;

    const expTimeNum = new Date(expTime).getTime();
    const currentTime = Date.now();

    if (expTimeNum <= currentTime) {
      return dateToSolar(new Date(expTimeNum));
    } else {
      const activateTime = expTimeNum - planTime;
      return dateToSolar(new Date(activateTime));
    }
  }, [data]);

  const expireTimeHandler = useCallback(() => {
    const { expTime } = data?.user || {};

    if (!expTime) return <Spinner size="sm" />;
    return dateToSolar(new Date(expTime));
  }, [data]);

  const timeLeftHandler = useCallback(() => {
    const { expTime } = data?.user || {};

    if (!expTime) return <Spinner size="sm" />;
    if (expTime <= Date.now()) {
      return (
        <span className="px-2 py-1 bg-red-500 text-white rounded-sm">
          منقضی شده
        </span>
      );
    }
    const diff = expTime - Date.now();
    const timeLeft = String(Math.floor(diff / (1000 * 60 * 60 * 24)));
    const timeLeftFormated = persianJs(timeLeft).persianNumber();
    return `${timeLeftFormated} روز`;
  }, [data]);

  if (isPending) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-2 lg:w-[450px] lg:self-center">
      <div className="card__title bg-[rgb(25,169,121)] text-white text-center sans-bold py-2 px-4">
        {data?.user?.plan == "free"
          ? "بسته آزمایشی (هفت روزه)"
          : "بسته اختصاصی (یکساله)"}
      </div>
      <div className="activate-time bg-gray-100 border-b p-2 flex justify-between items-center">
        <span className="label text-sm">تاریخ فعال سازی : </span>
        <span className="time text-sm">{activateTimeHandler()}</span>
      </div>
      <div className="activate-time bg-gray-100 border-b p-2 flex justify-between items-center">
        <span className="label text-sm">تاریخ انقضا : </span>
        <span className="time text-sm">{expireTimeHandler()}</span>
      </div>
      <div className="activate-time bg-gray-100 border-b p-2 flex justify-between items-center">
        <span className="label text-sm">روز های باقی مانده : </span>
        <span className="time text-sm">{timeLeftHandler()}</span>
      </div>
    </div>
  );
}

export default PackagesCard;
