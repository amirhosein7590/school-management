import { Button } from "@/components/modules/Button/button";
import DeleteCell from "@/components/modules/Table/Cell/DeleteCell";
import EditCell from "@/components/modules/Table/Cell/EditCell";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import dateToSolar from "@/utils/dateToSolar";
import { createColumnHelper } from "@tanstack/react-table";
import { CircleX } from "lucide-react";
import { Spinner } from "@/components/modules/spinner";
import BanCell from "@/components/modules/Table/Cell/BanCell";

const columnHelper = createColumnHelper();

const editDeleteManagerConfig = {
  inputs: {
    owner: [
      {
        type: "text",
        name: "firstName",
        placeholder: "نام ",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا نام  را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "lastName",
        className: "!text-sm !rounded-[5px] my-5",
        placeholder: "نام خانوادگی ",
        rules: {
          required: "لطفا نام خانوادگی  را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "phone",
        placeholder: "شماره تلفن ",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا شماره تلفن  را وارد کنید",
          pattern: {
            value: /^(?:\+?98|0)9\d{9}$/,
            message: "شماره تلفن نا معتبر است",
          },
        },
      },
      {
        type: "text",
        name: "nationalCode",
        placeholder: "کد ملی ",
        className: "!text-sm !rounded-[5px] my-5",
        rules: {
          required: "لطفا کد ملی  را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "personnelCode",
        placeholder: "کد پرسنلی ",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا کد پرسنلی  را وارد نمایید",
        },
      },
      {
        type: "select",
        name: "gender",
        placeholder: "جنسیت ",
        className: "!text-sm !rounded-[5px] !w-full my-5",
        options: [
          { label: "آقا", value: "male" },
          { label: "خانم", value: "female" },
        ],
        rules: {
          required: "لطفا جنسیت  را وارد نمایید",
        },
      },
      {
        type: "datePicker",
        name: "birthDay",
        placeholder: "تاریخ تولد ",
        className: "!text-sm !rounded-[5px] !w-full mt-4",
        rules: { required: "لطفا تاریخ تولد را وارد کنید" },
      },
    ],
    url: "/managers/id",
    method: "get",
    key: "manager",
    headers: null,
    deps: null,
    isPrivate: true,
    dataProp: "manager",
  },
  table: {
    columns: (role, showModal, user) => [
      columnHelper.display({
        id: "fullName",
        header: "نام و نام خانوادگی",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      }),
      columnHelper.display({
        id: "phone",
        header: "شماره تلفن",
        cell: ({ row }) => row.original.phone,
      }),
      columnHelper.display({
        id: "nationalCode",
        header: "کد ملی",
        cell: ({ row }) => row.original.nationalCode,
      }),
      columnHelper.display({
        id: "personnelCode",
        header: "کد پرسنلی",
        cell: ({ row }) => row.original.personnelCode,
      }),
      columnHelper.display({
        id: "gender",
        header: "جنسیت",
        cell: ({ row }) => (row.original.gender == "male" ? "آقا" : "خانم"),
      }),
      columnHelper.display({
        id: "birthDay",
        header: "تاریخ تولد",
        cell: ({ row }) => dateToSolar(row.original.birthDay),
      }),
      columnHelper.accessor("ban", {
        header: "وضعیت مسدودیت",
        cell: ({ row }) => (
          <BanCell
            id={row.original._id}
            entityName="managers"
            isBanned={row.original.isBanned}
            user={user}
          />
        ),
      }),
      columnHelper.accessor("actions", {
        header: "حذف / ویرایش",
        cell: ({ row }) => (
          <div className="actions-button flex justify-center gap-x-2 items-center">
            <DeleteCell
              id={row.original._id}
              url="/managers"
              entityName="مدیر"
              dataArrayName="managers"
              mutationKey="managers"
            />
            <EditCell
              id={row.original._id}
              user={user}
              entityName="editDeleteManager"
              modalTitle={`ویرایش ${row.original.firstName} ${row.original.lastName}`}
            />
          </div>
        ),
      }),
    ],
    dataArrayName: "managers",
    url: "/managers",
    method: "get",
    key: "managers",
    deps: null,
    isPrivate: true,
    headers: null,
  },
  url: "/managers/id",
  key: "managers",
  method: "put",
  headers: { "content-type": "application/json" },
  isPrivate: true,
  deps: null,
};

export default editDeleteManagerConfig;
