import { Button } from "@/components/modules/Button/button";
import DescriptionCell from "@/components/modules/Table/Cell/DescriptionCell";
import dateToSolar from "@/utils/dateToSolar";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();
const showDateHandler = (date) => {
  const originalTime = new Date(date).getTime();
  const formatedDate = new Date(originalTime + 16400000);
  return dateToSolar(formatedDate);
};
const statusAttendanceConfig = {
  present: {
    className: "!bg-green-200 !text-green-600",
    text: "حاضر",
  },
  absent: {
    className: "!bg-red-200 !text-red-600",
    text: "غیبت غیر موجه",
  },
  excused: {
    className: "bg-orange-200 !text-orange-600",
    text: "غیبت موجه",
  },
  late: {
    className: "!bg-blue-200 !text-blue-600",
    text: "تاخیر",
  },
  other: {
    className: "!bg-yellow-200 !text-yellow-600",
    text: "سایر",
  },
};

const showStudentReportConfig = {
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
      columnHelper.display({
        id: "status",
        header: "وضعیت حضور",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className={`w-28 !rounded-[5px] !text-center ${
              statusAttendanceConfig[row.original?.status]?.className
            }`}
          >
            <span className="flex justify-center items-center w-full">
              {statusAttendanceConfig[row.original?.status]?.text}
            </span>
          </Button>
        ),
      }),
      columnHelper.display({
        id: "date",
        header: "تاریخ",
        cell: ({ row }) => showDateHandler(row.original.date),
      }),
      columnHelper.display({
        id: "time",
        header: "ساعت",
        cell: ({ row }) => row.original?.time ?? "",
      }),
      columnHelper.display({
        id: "description",
        header: "توضیحات",
        cell: ({ row }) => (
          <DescriptionCell
            mode="show"
            defaultStatus={row.original.status}
            defaultValue={row.original?.description ?? "توضیحی ثبت نشده است"}
          />
        ),
      }),
    ],
    dataArrayName: "report",
    url: "/studentsAttendances/report",
    method: "get",
    key: "studentsAttendances/report",
    deps: null,
    isPrivate: true,
    headers: null,
  },
};

export default showStudentReportConfig;
