import { Button } from "@/components/modules/Button/button";
import DeleteCell from "@/components/modules/Table/Cell/DeleteCell";

const { createColumnHelper } = require("@tanstack/react-table");

const columnHelper = createColumnHelper();

const showMessageHandler = (message, showModal) => {
  showModal({
    title: "پیام",
    size: "lg",
    content: () => <span dir="rtl">{message}</span>,
  });
};

const subjectLabels = {
  problem: "گزارش مشکلات سامانه",
  suggest: "پیشنهادی برای بهبود سامانه",
  other: "سایر",
};

const editDeleteSuggestConfig = {
  table: {
    columns: (role, showModal, user) => [
      columnHelper.accessor("message", {
        header: "پیام",
        cell: ({ row }) => (
          <Button
            className="cursor-pointer"
            onClick={() => showMessageHandler(row.original.text, showModal)}
            size="sm"
          >
            مشاهده پیام
          </Button>
        ),
      }),
      columnHelper.display({
        id: "subject",
        header: "نوع بازخورد",
        cell: ({ row }) => subjectLabels[row.original.subject],
      }),
      columnHelper.display({
        id: "fullName",
        header: "نام و نام خانوادگی",
        cell: ({ row }) =>
          `${row.original?.sender?.firstName ?? ""} ${row.original?.sender?.lastName ?? ""}`,
      }),
      columnHelper.display({
        id: "role",
        header: "نقش",
        cell: ({ row }) =>
          row.original.senderModel == "Manager" ? "مدیر" : "معلم",
      }),
      columnHelper.display({
        id: "phone",
        header: "شماره تلفن",
        cell: ({ row }) => row.original?.sender.phone ?? "",
      }),
      columnHelper.display({
        id: "nationalCode",
        header: "کد ملی",
        cell: ({ row }) => row.original?.sender?.nationalCode ?? "",
      }),
      columnHelper.accessor("action", {
        header: "حذف",
        cell: ({ row }) => (
          <div className="action-button flex justify-center gap-x-2 items-center">
            <DeleteCell
              id={row.original._id}
              url="/suggests"
              entityName="پیشنهاد / انتقاد"
              dataArrayName="suggests"
              mutationKey="suggests"
            />
          </div>
        ),
      }),
    ],
    dataArrayName: "suggests",
    url: "/suggests",
    method: "get",
    key: "suggests",
    deps: null,
    isPrivate: true,
    headers: null,
  },
  url: "/suggests/id",
  key: "suggests",
  method: "put",
  headers: { "content-type": "application/json" },
  isPrivate: true,
  deps: null,
};

export default editDeleteSuggestConfig;
