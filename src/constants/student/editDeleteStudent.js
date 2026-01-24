import { Button } from "@/components/modules/Button/button";
import { Spinner } from "@/components/modules/spinner";
import DeleteCell from "@/components/modules/Table/Cell/DeleteCell";
import EditCell from "@/components/modules/Table/Cell/EditCell";
import dateToSolar from "@/utils/dateToSolar";
import { createColumnHelper } from "@tanstack/react-table";
import { CircleX } from "lucide-react";
import useCustomeMutation from "@/hooks/useCustomeMutation";

const columnHelper = createColumnHelper();

const removeStudentFromClass = (showModal, studentId, classId) => {
  showModal({
    size: "sm",
    content: ({ close }) => {
      const { mutateAsync, isPending } = useCustomeMutation(
        "students",
        null,
        `/students/${studentId}/deleteClass`,
        { "content-type": "application/json" },
        "post"
      );
      return (
        <div className="flex flex-col">
          <p className="title text-center sans-bold text-lg">
            حذف دانش آموز از کلاس
          </p>
          <p className="description text-gray-500 my-5 text-sm text-center">
            با انجام این عملیات دیگر دانش آموز به معلم این کلاس دسترسی ندارد ،
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

const editDeleteStudentConfig = {
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
        name: "parentPhone",
        placeholder: "شماره تلفن والد ",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا شماره تلفن والد را وارد کنید",
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
        type: "datePicker",
        name: "birthDay",
        placeholder: "تاریخ تولد ",
        className: "!text-sm !rounded-[5px] !w-full",
        rules: { required: "لطفا تاریخ تولد را وارد کنید" },
      },
    ],
    url: "/students/id",
    method: "get",
    key: "student",
    headers: null,
    deps: null,
    isPrivate: true,
    dataProp: "student",
  },
  table: {
    columns: (role, showModal, user) => [
      columnHelper.display({
        id: "fullName",
        header: "نام و نام خانوادگی",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      }),
      columnHelper.display({
        id: "parentPhone",
        header: "شماره تلفن والد",
        cell: ({ row }) => row.original.parentPhone,
      }),
      columnHelper.display({
        id: "nationalCode",
        header: "کد ملی",
        cell: ({ row }) => row.original.nationalCode,
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
                  removeStudentFromClass(
                    showModal,
                    row.original?._id,
                    row.original?.class?._id
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
      columnHelper.accessor("actions", {
        header: "حذف / ویرایش",
        cell: ({ row }) => (
          <div className="actions-button flex justify-center gap-x-2 items-center">
            <DeleteCell
              id={row.original._id}
              url="/students"
              entityName="دانش آموز"
              dataArrayName="students"
              mutationKey="students"
            />
            <EditCell
              id={row.original._id}
              user={user}
              entityName="editDeleteStudent"
              modalTitle={`ویرایش ${row.original.firstName} ${row.original.lastName}`}
            />
          </div>
        ),
      }),
    ],
    dataArrayName: "students",
    url: "/students",
    method: "get",
    key: "students",
    deps: null,
    isPrivate: true,
    headers: null,
  },
  url: "/students/id",
  key: "students",
  method: "put",
  headers: { "content-type": "application/json" },
  isPrivate: true,
  deps: null,
};

export default editDeleteStudentConfig;
