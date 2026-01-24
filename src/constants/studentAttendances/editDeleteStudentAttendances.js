import StatusButtons from "@/components/modules/Button/StatusButton";
import DeleteCell from "@/components/modules/Table/Cell/DeleteCell";
import DescriptionCell from "@/components/modules/Table/Cell/DescriptionCell";
import TimeCell from "@/components/modules/Table/Cell/TimeCell";
import { createColumnHelper } from "@tanstack/react-table";
import EditAttendanceCell from "@/components/modules/Table/Cell/EditAttendanceCell";
import DatePicker from "@/components/modules/datePicker";
import dateToSolar from "@/utils/dateToSolar";
import SendAbsentSmsCell from "@/components/modules/Table/Cell/sendAbsentSmsCell";

const columnHelper = createColumnHelper();
const showDateHandler = (date) => {
  const originalTime = new Date(date).getTime();
  const formatedDate = new Date(originalTime + 16400000);
  return dateToSolar(formatedDate);
};

const editDeleteStudentAttendancesConfig = {
  table: {
    columns: (role, showModal, user) => [
      columnHelper.display({
        id: "fullName",
        header: "نام و نام خانوادگی",
        cell: ({ row }) =>
          `${row.original?.student?.firstName ?? "حذف شده"} ${
            row.original?.student?.lastName ?? ""
          }`,
      }),
      columnHelper.accessor("status", {
        header: "وضعیت غیبت",
        cell: ({ row }) => (
          <StatusButtons
            rowId={row.original._id}
            defaultStatus={row.original.status}
            key={row.original._id}
          />
        ),
      }),
      columnHelper.display({
        id: "sms",
        header: "پیامک غیبت",
        cell: ({ row }) => (
          <SendAbsentSmsCell
            url={`/studentsAttendances/${row.original._id}/sendAttendanceSms`}
            mutationKey="/studentsAttendances/sendAttendanceSms"
          />
        ),
      }),
      columnHelper.display({
        id: "description",
        header: "توضیحات",
        cell: ({ row }) => (
          <DescriptionCell
            defaultStatus={row.original.status}
            rowId={row.original._id}
            defaultValue={row.original?.description}
          />
        ),
      }),
      columnHelper.display({
        id: "date",
        header: "تاریخ",
        cell: ({ row }) => (
          <DatePicker
            rowId={row.original._id}
            placeholder={showDateHandler(row.original.date)}
            mode="attendance"
            className="!text-sm !rounded-[5px]"
          />
        ),
      }),
      columnHelper.display({
        id: "time",
        header: "ساعت",
        cell: ({ row }) => (
          <TimeCell
            defaultStatus={row.original.status}
            defaultTime={row.original?.time}
            rowId={row.original._id}
          />
        ),
      }),
      columnHelper.accessor("actions", {
        header: "حذف / ویرایش",
        cell: ({ row }) => (
          <div className="actions-button flex justify-center gap-x-4 items-center">
            <DeleteCell
              id={row.original._id}
              url="/studentsAttendances"
              entityName="غیبت"
              dataArrayName="attendances"
              mutationKey="studentsAttendances"
              // className="ml-4"
            />
            <EditAttendanceCell
              url={`/studentsAttendances/${row.original._id}`}
              deps={null}
              mutationKey="studentsAttendances"
              row={row.original}
              defaultStatus={row.original?.status}
              defaultDescription={row.original?.description}
              defaultTime={row.original?.time}
              defaultDate={row.original?.date}
              teacherOrStudent="student"
            />
          </div>
        ),
      }),
    ],
    dataArrayName: "attendances",
    url: "/studentsAttendances",
    method: "get",
    key: "studentsAttendances",
    deps: null,
    isPrivate: true,
    headers: null,
  },
};

export default editDeleteStudentAttendancesConfig;
