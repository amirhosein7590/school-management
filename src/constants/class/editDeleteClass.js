import DeleteCell from "@/components/modules/Table/Cell/DeleteCell";
import EditCell from "@/components/modules/Table/Cell/EditCell";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const editDeleteClassConfig = {
  inputs: {
    manager: [
      {
        type: "text",
        name: "name",
        placeholder: "نام کلاس",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا نام مدرسه را وارد نمایید",
        },
      },
      {
        type: "number",
        name: "capacity",
        className: "!text-sm !rounded-none my-5",
        placeholder: "ظرفیت کلاس",
        rules: {
          required: "لطفا ظرفیت کلاس را وارد نمایید",
        },
      },
      {
        type: "select",
        name: "grade",
        placeholder: "پایه",
        className: "!w-full",
        multiple: false,
        options: [
          { label: "پایه اول", value: "1" },
          { label: "پایه دوم", value: "2" },
          { label: "پایه سوم", value: "3" },
          { label: "پایه چهارم", value: "4" },
          { label: "پایه پنجم", value: "5" },
          { label: "پایه ششم", value: "6" },
          { label: "پایه هفتم", value: "7" },
          { label: "پایه هشتم", value: "8" },
          { label: "پایه نهم", value: "9" },
          { label: "پایه دهم", value: "10" },
          { label: "پایه یازدهم", value: "11" },
          { label: "پایه دوازدهم", value: "12" },
        ],
        rules: {
          required: "لطفا پایه را وارد نمایید",
        },
      },
    ],
    url: "/classes/id",
    method: "get",
    key: "class",
    deps: null,
    isPrivate: true,
    headers: null,
    dataProp: "class",
  },
  table: {
    columns: (role, showModal, user) => [
      columnHelper.display({
        id: "name",
        header: "نام کلاس",
        cell: ({ row }) => row.original.name,
      }),
      columnHelper.display({
        id: "capacity",
        header: "ظرفیت کلاس",
        cell: ({ row }) => row.original.capacity,
      }),
      columnHelper.display({
        id: "grade",
        header: "پایه",
        cell: ({ row }) => row.original.grade,
      }),
      columnHelper.accessor("actions", {
        header: "حذف / ویرایش",
        cell: ({ row }) => (
          <div className="actions-button flex justify-center gap-x-2 items-center">
            <DeleteCell
              id={row.original._id}
              url="/classes"
              entityName="کلاس"
              dataArrayName="classes"
              mutationKey="classes"
            />
            <EditCell
              id={row.original._id}
              user={user}
              entityName="editDeleteClass"
              modalTitle={`ویرایش ${
                row.original.name && row.original.name.includes("کلاس")
                  ? row.original.name
                  : `کلاس ${row.original.name ?? ""}`
              }`}
            />
          </div>
        ),
      }),
    ],

    dataArrayName: "classes",
    url: "/classes",
    method: "get",
    key: "classes",
    deps: null,
    isPrivate: true,
    headers: null,
  },
  url: "/classes/id",
  key: "classes",
  method: "put",
  headers: { "content-type": "application/json" },
  isPrivate: true,
  deps: null,
};

export default editDeleteClassConfig;
