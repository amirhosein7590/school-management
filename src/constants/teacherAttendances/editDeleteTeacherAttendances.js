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

const editDeleteTeacherAttendancesConfig = {
  table: {
    columns: (role, showModal, user) => [
      columnHelper.display({
        id: "fullName",
        header: "نام و نام خانوادگی",
        cell: ({ row }) =>
          `${row.original?.teacher?.firstName ?? "حذف شده"} ${
            row.original?.teacher?.lastName ?? ""
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
          <>
            {row.original.status != "present" && (
              <SendAbsentSmsCell
                url={`/teachersAttendances/${row.original._id}/sendAttendanceSms`}
                mutationKey="/teachersAttendances/sendAttendanceSms"
              />
            )}
          </>
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
              url="/teachersAttendances"
              entityName="غیبت"
              dataArrayName="attendances"
              mutationKey="teachersAttendances"
              // className="ml-4"
            />
            <EditAttendanceCell
              url={`/teachersAttendances/${row.original._id}`}
              deps={null}
              mutationKey="teachersAttendances"
              row={row.original}
              defaultStatus={row.original?.status}
              defaultDescription={row.original?.description}
              defaultTime={row.original?.time}
              defaultDate={row.original?.date}
            />
          </div>
        ),
      }),
    ],
    dataArrayName: "attendances",
    url: "/teachersAttendances",
    method: "get",
    key: "teachersAttendances",
    deps: null,
    isPrivate: true,
    headers: null,
  },
};

export default editDeleteTeacherAttendancesConfig;
