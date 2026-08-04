import React, { useRef, useState } from "react";
import { Button } from "./button";
import { Input } from "../input";
import { Label } from "@radix-ui/react-label";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { Spinner } from "../spinner";
import { useContext } from "react";
import { useModal } from "@/hooks/useModal";

function ImportFromExcel({ user, disabled, queryKey, text, importConfig }) {
  const { showModal } = useModal();
  if (!queryKey || !text || !importConfig) return;
  const entityNames = {
    students: "دانش آموزان",
    teachers: "معلمان",
  };

  const importHandler = () => {
    showModal({
      title: `ایجاد گروهی ${entityNames[queryKey]}`,
      size: "lg",
      content: ({ close }) => {
        const [fileName, setFileName] = useState("");
        const inputRef = useRef();
        const { mutateAsync, isPending } = useCustomeMutation(
          queryKey,
          null,
          `/${queryKey}/groupAdding`,
          { "content-type": "application/json" },
          "post",
          true,
        );
        const uploadHandler = async () => {
          const file = inputRef?.current?.files?.[0];
          if (!file) {
            toast.error("لطفا فایل را انتخاب کنید");
            return;
          }
          if (!file?.name?.endsWith(".xlsx")) {
            toast.error("فرمت فایل نامعتیر است");
            return;
          }
          const { data, errors } = await importConfig(file);
          if (errors?.length > 0) {
            const error = errors?.[0];
            toast.error(error);
            return;
          }

          if (data?.length < 1) {
            toast.error("استخراج دیتا از فایل اکسل ناموفق بود !!");
            return;
          }

          await mutateAsync({ [queryKey]: data });
          close();
        };
        return (
          <div dir="rtl" className="flex flex-col">
            <ul className="guide">
              <li className="list-disc text-sm">
                ابتدا فایل نمونه (اکسل) را دانلود کرده و مطابق راهنما آن را
                تکمیل نمایید
              </li>
              <li className="list-disc text-sm my-4">
                لطفا برای سادگی و جلوگیری از خطا از فایل نمونه استفاده کرده و آن
                را ویرایش کنید
              </li>
              <li className="list-disc text-sm mb-4">
                تاریخ تولد باید با اعداد فارسی باشد
              </li>
              <li className="list-disc text-sm">
                لطفا نام و تعداد سلول های ردیف اول (نام و نام خانوادگی و ...) را
                تغییر ندهید
              </li>
            </ul>

            <div className="button-container">
              <Button
                href={`/files/excel/${queryKey}.xlsx`}
                download={`${entityNames[queryKey]}.xlsx`}
                type="button"
                variant="ghost"
                size="sm"
                className="text-white mt-4 cursor-pointer rounded-[3px] bg-green-600"
              >
                دانلود فایل نمونه
              </Button>
            </div>
            <div className="form w-full flex flex-col">
              <Input
                ref={inputRef}
                onChange={(event) => setFileName(event.target.files[0]?.name)}
                type="file"
                className="invisible"
                id="excel-file"
              />
              <Label
                htmlFor="excel-file"
                className="text-sm rounded-[3px] flex justify-between items-center border py-2 px-4 w-full"
              >
                {fileName
                  ? fileName
                  : `انتخاب فایل اکسل ${entityNames[queryKey]}`}
                <Paperclip color="gray" className="!w-5 !h-5" />
              </Label>

              <Button
                onClick={uploadHandler}
                size="sm"
                className=" rounded-[3px] w-25 flex justify-center items-center mt-4 cursor-pointer hover:deocration-0"
              >
                {isPending ? <Spinner size="sm" /> : "بارگذاری فایل"}
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <Button
      onClick={importHandler}
      type="button"
      size="sm"
      variant="ghost"
      disabled={disabled}
      className="bg-green-600 text-white cursor-pointer rounded-[3px]"
    >
      {text}
    </Button>
  );
}

export default ImportFromExcel;
