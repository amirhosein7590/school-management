import DeleteCell from "@/components/modules/Table/Cell/DeleteCell";
import EditCell from "@/components/modules/Table/Cell/EditCell";
import dateToSolar from "@/utils/dateToSolar";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const editDeleteTeacher = {
  inputs: {
    manager: [
      {
        type: "text",
        name: "firstName",
        placeholder: "نام معلم",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا نام معلم را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "lastName",
        className: "!text-sm !rounded-none my-5",
        placeholder: "نام خانوادگی معلم",
        rules: {
          required: "لطفا نام خانوادگی معلم را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "phone",
        placeholder: "شماره تلفن معلم",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا شماره تلفن معلم را وارد کنید",
          pattern: {
            value: /^(?:\+?98|0)9\d{9}$/,
            message: "شماره تلفن نا معتبر است",
          },
        },
      },
      {
        type: "text",
        name: "nationalCode",
        placeholder: "کد ملی معلم",
        className: "!text-sm !rounded-none my-5",
        rules: {
          required: "لطفا کد ملی معلم را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "personnelCode",
        placeholder: "کد پرسنلی معلم",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا کد پرسنلی معلم را وارد نمایید",
        },
      },
      {
        type: "select",
        name: "gender",
        placeholder: "جنسیت معلم",
        className: "!text-sm !rounded-none !w-full my-5",
        options: [
          { label: "مرد", value: "male" },
          { label: "زن", value: "female" },
        ],
        rules: {
          required: "لطفا جنسیت معلم را وارد نمایید",
        },
      },
      {
        type: "datePicker",
        name: "birthDay",
        placeholder: "تاریخ تولد معلم",
        className: "!text-sm !rounded-none !w-full",
        rules: { required: "لطفا تاریخ تولد معلم را وارد کنید" },
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
        cell: ({ row }) => (row.original.gender == "male" ? "مرد" : "زن"),
      }),
      columnHelper.display({
        id: "birthDay",
        header: "تاریخ تولد",
        cell: ({ row }) => dateToSolar(row.original.birthDay),
      }),
      columnHelper.display({
        id: "class",
        header: "کلاس",
        cell: ({ row }) => row.original?.class?.name ?? "-- --",
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
              modalTitle={`ویرایش ${row.original.firstName}`}
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
