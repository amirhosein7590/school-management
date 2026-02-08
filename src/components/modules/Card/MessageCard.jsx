import useCustomeQuery from "@/hooks/useCustomeQuery";
import React from "react";
import { Spinner } from "../spinner";
import persianJs from "persianjs";
import { Info } from "lucide-react";

function MessageCard() {
    const { data, isPending } = useCustomeQuery(
        "me",
        null,
        "/auth/me",
        null,
        true,
    );

    const remainingMessages = () => {
        if (!data?.user?.messagesCharge) return persianJs("0").persianNumber()._str
        return persianJs(String(data?.user?.messagesCharge)).persianNumber()._str
    }

    if (isPending) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col px-4 py-2 lg:w-[450px] lg:self-center">
            <div className="card__title bg-[var(--base-orange)] text-white text-center sans-bold py-2 px-4">
                پنل پیامکی
            </div>
            <div className="activate-time bg-gray-100 border-b p-2 flex justify-between items-center">
                <span className="label text-sm">تعداد پیامک باقی مانده: </span>
                <span className="time text-sm">{remainingMessages()} پیامک</span>
            </div>
            <div className="activate-time bg-gray-100 border-b p-2 flex justify-between items-center">
                <span className="label text-sm flex items-center gap-x-1"> <Info size="17" color="green" /> هزینه هر پیامک 200 تومان می باشد.</span>
            </div>
        </div>
    );
}

export default MessageCard;
