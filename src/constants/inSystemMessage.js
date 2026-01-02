import { Button } from "@/components/modules/Button/button";
import { createColumnHelper } from "@tanstack/react-table";
const columnHelper = createColumnHelper();

const inSystemMessageConfig = {
  inputs: {
    teacher: [
      {
        type: "textarea",
        placeholder: "متن پیام را وارد کنید",
        name: "text",
        className: "!text-sm bg-white order-1 mt-3",
        rules: {
          required: "لطفا متن پیام را وارد کنید",
        },
      },
      {
        type: "select",
        name: "receiver",
        className: "w-full lg:w-auto",
        rules: {
          required: "لطفا گیرنده را مشخص کنید",
        },
        multiple: false,
        placeholder: "گیرنده",
        options: {
          url: "/me",
          method: "get",
          key: "me",
          deps: null,
          isPrivate: true,
          headers: null,
          optionsGenerator: (data) => {
            if (!data) return [];
            return [{ label: "مدیر", value: data?.user?.manager?._id }];
          },
        },
      },
    ],
    manager: [
      {
        type: "textarea",
        placeholder: "متن پیام را وارد کنید",
        name: "text",
        className: "!text-sm bg-white order-1 mt-3",
        rules: {
          required: "لطفا متن پیام را وارد کنید",
        },
      },
      {
        type: "select",
        name: "receiver",
        className: "w-full lg:w-auto",
        rules: {
          required: "لطفا گیرنده را مشخص کنید",
        },
        multiple: false,
        placeholder: "گیرنده",
        options: {
          url: "/teachers",
          method: "get",
          key: "teachers",
          deps: null,
          isPrivate: true,
          headers: null,
          optionsGenerator: (data) => {
            if (!data) return [];
            const teachers = data.teachers.map((teacher) => ({
              label: `${teacher.firstName} ${teacher.lastName}`,
              value: teacher._id,
            }));
            return [{ label: "مالک", value: "owner" }, ...teachers];
          },
        },
      },
    ],
    owner: [
      {
        type: "textarea",
        placeholder: "متن پیام را وارد کنید",
        name: "text",
        className: " !text-sm bg-white order-1 mt-3",
        rules: {
          required: "لطفا متن پیام را وارد کنید",
        },
      },
      {
        type: "select",
        name: "receiver",
        className: "w-full lg:w-auto",
        rules: {
          required: "لطفا گیرنده را مشخص کنید",
        },
        multiple: false,
        placeholder: "گیرنده",
        options: {
          url: "/managers",
          method: "get",
          key: "managers",
          deps: null,
          isPrivate: true,
          headers: null,
          optionsGenerator: (data) => {
            if (!data) return [];
            return data?.managers.map((manager) => ({
              label: `${manager.firstName} ${manager.lastName}`,
              value: manager._id,
            }));
          },
        },
      },
    ],
  },
  table: {
    columns: (role) => [
      columnHelper.display({
        id: "text",
        header: "پیام",
        cell: ({ row }) => row.original.text,
      }),
      columnHelper.display({
        id: "sender",
        headers: "فرستنده",
        cell: ({ row }) => row.original.sender.fullName,
      }),
      columnHelper.display({
        id: "receiver",
        header: "گیرنده",
        cell: ({ row }) => row.original.receiver.fullName,
      }),
      columnHelper.accessor("replay", {
        header: "پاسخ",
        cell: ({ row }) => {
          if (role == row.original.receiver.role) {
            return (
              <>
                {row?.replay?.text ? (
                  <Button size="sm" onClick={() => console.log("مودال باز شد")}>
                    مشاهده پاسخ
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => console.log("مودال باز شد")}>
                    ارسال پاسخ
                  </Button>
                )}
              </>
            );
          } else {
            return (
              <>
                {row?.replay?.text ? (
                  <Button onClick={() => console.log("مودال باز شد")}>
                    مشاهده پاسخ
                  </Button>
                ) : (
                  <p>بررسی نشده است</p>
                )}
              </>
            );
          }
        },
      }),
    ],
    dataArrayName: "messages",
    url: "/messages",
    method: "get",
    key: "messages",
    deps: null,
    isPrivate: true,
    headers: null,
  },
  url: "/messages",
  method: "post",
  key: "messages",
  deps: null,
  isPrivate: true,
  headers: { "content-type": "application/json" },
};

export default inSystemMessageConfig;
