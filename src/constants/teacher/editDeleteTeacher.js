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

const removeTeacherFromClass = (showModal, teacherId, classId) => {
  showModal({
    size: "sm",
    content: ({ close }) => {
      const { mutateAsync, isPending } = useCustomeMutation(
        "teachers",
        null,
        `/teachers/${teacherId}/deleteClass`,
        { "content-type": "application/json" },
        "post",
      );
      return (
        <div className="flex flex-col">
          <p className="title text-center sans-bold text-lg">
            حذف معلم از کلاس
          </p>
          <p className="description text-gray-500 my-5 text-sm text-center">
            با انجام این عملیات دیگر معلم به دانش آموزان این کلاس دسترسی ندارد ،
            آیا از انجام این عملیات اطمینان دارید ؟
          </p>
          <div className="buttons-container flex items-center justify-center gap-x-2">
            <Button
              onClick={close}
              variant="secondary"
              className="text-center cursor-pointer w-1/2 flex justify-center items-center"
            >
              انصراف
            </Button>
            <Button
              onClick={async () => {
                await mutateAsync({ classId });
                close();
              }}
              size="sm"
              variant="destructive"
              className={`text-center w-1/2 flex justify-center items-center ${
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isPending ? <Spinner size="sm" /> : "حذف"}
            </Button>
          </div>
        </div>
      );
    },
  });
};

const editDeleteTeacher = {
  inputs: {
    manager: [
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
            value: /^(?:\+?98|0)[۰-۹0-9]{10}$/,
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
    url: "/teachers/id",
    method: "get",
    key: "teacher",
    headers: null,
    deps: null,
    isPrivate: true,
    dataProp: "teacher",
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
      columnHelper.display({
        id: "class",
        header: "کلاس",
        cell: ({ row }) =>
          row.original?.class?.name ? (
            <div className="flex justify-center items-center gap-x-2">
              <span>{row.original?.class?.name}</span>
              <Button
                onClick={() =>
                  removeTeacherFromClass(
                    showModal,
                    row.original?._id,
                    row.original?.class?._id,
                  )
                }
                variant="ghost"
                size="sm"
                className="!p-0 !m-0 flex justify-between items-center cursor-pointer"
              >
                <CircleX color="red" />
              </Button>
            </div>
          ) : (
            "-- --"
          ),
      }),
      columnHelper.accessor("ban", {
        header: "وضعیت مسدودیت",
        cell: ({ row }) => (
          <BanCell
            id={row.original._id}
            entityName="teachers"
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
              url="/teachers"
              entityName="معلم"
              dataArrayName="teachers"
              mutationKey="teachers"
            />
            <EditCell
              id={row.original._id}
              user={user}
              entityName="editDeleteTeacher"
              modalTitle={`ویرایش ${row.original.firstName} ${row.original.lastName}`}
            />
          </div>
        ),
      }),
    ],
    dataArrayName: "teachers",
    url: "/teachers",
    method: "get",
    key: "teachers",
    deps: null,
    isPrivate: true,
    headers: null,
  },
  url: "/teachers/id",
  key: "teachers",
  method: "put",
  headers: { "content-type": "application/json" },
  isPrivate: true,
  deps: null,
};

export default editDeleteTeacher;
