import registryEntity from "@/utils/registryEntity";
import React, { memo } from "react";
import { Button } from "./Button/button";
import { CircleQuestionMark } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

function PageGuide({ entityName, pageName }) {
  const { texts } = registryEntity.pageGuide[entityName];
  const { showModal } = useModal();
  return (
    <div className="flex items-center pb-5 border-b border-gray-300 mb-10">
      <div className="page-name sans-bold text-lg ml-1">{pageName}</div>
      <Button
        onClick={() =>
          showModal({
            title: "بخش حضور و غیاب",
            size: "lg",
            content: () => (
              <ul
                dir="rtl"
                className="text-guide-container flex flex-col gap-y-2 list-disc"
              >
                {texts.map((text) => (
                  <li className="text-sm" key={text}>
                    {text}
                  </li>
                ))}
              </ul>
            ),
          })
        }
        tooltip="راهنما"
        className="cursor-pointer"
        variant="icon"
      >
        <CircleQuestionMark className="!w-5 !h-5 rotate-y-180 text-gray-400" />
      </Button>
    </div>
  );
}

export default memo(PageGuide);
