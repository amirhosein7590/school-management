import DeleteCell from "@/components/modules/Table/Cell/DeleteCell";
import EditCell from "@/components/modules/Table/Cell/EditCell";
import { createColumnHelper } from "@tanstack/react-table";
import persianJs from "persianjs";
const columnHelper = createColumnHelper();

const genderLabels = {
  boyish: "پسرانه",
  girlish: "دخترانه",
  mixed: "مختلط",
};

const editDeleteSchoolConfig = {
  inputs: {
    owner: [
      {
        type: "text",
        name: "name",
        placeholder: "نام مدرسه",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا نام مدرسه را وارد کنید",
        },
      },
      {
        type: "text",
        name: "address",
        placeholder: "آدرس مدرسه",
        className: "!text-sm !rounded-[5px] my-4",
        rules: {
          required: "لطفا آدرس مدرسه را وارد کنید",
        },
      },
      {
        type: "select",
        name: "level",
        placeholder: "دوره مدرسه",
        className: "!text-sm !rounded-[5px] !w-full",
        multiple: false,
        options: [
          { label: "دوره اول", value: "1" },
          { label: "دوره دوم", value: "2" },
        ],
        rules: {
          required: "لطفا دوره مدرسه را وارد کنید",
        },
      },
      {
        type: "select",
        name: "shift",
        multiple: false,
        placeholder: "شیفت مدرسه",
        className: "!text-sm !rounded-[5px] !w-full my-4",
        options: [
          { label: "شیفت صبح", value: "morning" },
          { label: "شیفت عصر", value: "evening" },
        ],
        rules: {
          required: "لطفا شیفت مدرسه را وارد کنید",
        },
      },
      {
        type: "select",
        name: "gender",
        placeholder: "پسرانه / دخترانه",
        multiple: false,
        className: "!text-sm !rounded-[5px] !w-full",
        options: [
          { label: "پسرانه", value: "boyish" },
          { label: "دخترانه", value: "girlish" },
          { label: "مختلط", value: "mixed" },
        ],
        rules: {
          required: "لطفا دوره مدرسه را وارد کنید",
        },
      },
      {
        type: "text",
        name: "phone",
        placeholder: "شماره مدرسه",
        className: "!text-sm !rounded-[5px] my-4",
        rules: {
          required: "لطفا شماره مدرسه را وارد کنید",
          pattern: {
            value: /[0-9]/,
            message: "شماره تلفن نامعتبر است",
          },
        },
      },
    ],
    url: "/schools/id/",
    method: "get",
    key: "school",
    deps: null,
    headers: { "content-type": "application/json" },
    isPrivate: true,
    dataProp: "school",
  },
  table: {
    columns: (role, showModal, user) => [
      columnHelper.display({
        id: "name",
        header: "نام",
        cell: ({ row }) => row.original.name,
      }),
      columnHelper.display({
        id: "address",
        header: "آدرس",
        cell: ({ row }) => row.original.address,
      }),
      columnHelper.display({
        id: "level",
        header: "دوره",
        cell: ({ row }) =>
          row.original.level == "1" ? "دوره اول" : "دوره دوم",
      }),
      columnHelper.display({
        id: "shift",
        header: "شیفت",
        cell: ({ row }) => (row.original.shift == "morning" ? "صبح" : "عصر"),
      }),
      columnHelper.display({
        id: "phone",
        header: "تلفن",
        cell: ({ row }) => persianJs(row.original.phone).persianNumber()._str,
      }),
      columnHelper.display({
        id: "gender",
        header: "جنبست",
        cell: ({ row }) => genderLabels[row.original.gender],
      }),
      columnHelper.display({
        id: "manager",
        header: "مدیر",
        cell: ({ row }) =>
          `${row.original?.manager?.firstName ?? ""} ${row.original?.manager?.lastName ?? ""}`,
      }),
      columnHelper.accessor("actions", {
        header: "حذف / ویرایش",
        cell: ({ row }) => (
          <div className="actions-button flex justify-center gap-x-2 items-center">
            <DeleteCell
              id={row.original._id}
              url="/schools"
              entityName="مدرسه"
              dataArrayName="schools"
              mutationKey="schools"
            />
            <EditCell
              id={row.original._id}
              user={user}
              entityName="editDeleteSchool"
              modalTitle={`ویرایش ${row.original.name}`}
            />
          </div>
        ),
      }),
    ],
    dataArrayName: "schools",
    url: "/schools",
    method: "get",
    key: "schools",
    deps: null,
    isPrivate: true,
    headers: null,
  },
  url: "/schools/id/",
  method: "put",
  key: "schools",
  deps: null,
  headers: { "content-type": "application/json" },
  isPrivate: true,
};

export default editDeleteSchoolConfig;
