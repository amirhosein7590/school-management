import DeleteCell from "@/components/modules/Table/Cell/DeleteCell";
import EditCell from "@/components/modules/Table/Cell/EditCell";
import dateToSolar from "@/utils/dateToSolar";
import { createColumnHelper } from "@tanstack/react-table";
import BanCell from "@/components/modules/Table/Cell/BanCell";
import PlanCell from "@/components/modules/Table/Cell/PlanCell";
import MessagesChargeCell from "@/components/modules/Table/Cell/messagesChargeCell";

const columnHelper = createColumnHelper();
const remainingDaysOfPlanHandler = (time) => {
  const originalTime = Number(time);
  const today = Date.now();

  if (originalTime < today) {
    return "منقضی شده";
  }

  const differenceMs = originalTime - today;

  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const remainingDays = Math.ceil(differenceMs / millisecondsInDay);

  return `${remainingDays} روز`;
};

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
      columnHelper.display({
        id: "planType",
        header: "پلن",
        cell: ({ row }) =>
          row.original?.plan == "free" ? "رایگان (هفت روزه)" : "اشتراک یکساله",
      }),
      columnHelper.display({
        id: "remainingDaysOfPlan",
        header: "روز های باقی مانده از پلن",
        cell: ({ row }) => remainingDaysOfPlanHandler(row.original?.expTime),
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
      columnHelper.accessor("planRenewal", {
        header: "تمدید پلن",
        cell: ({ row }) => <PlanCell managerId={row.original._id} />,
      }),
      columnHelper.accessor("messagesCharge", {
        id: "messagesCharge",
        header: "شارژ بسته پیامکی",
        cell: ({ row }) => (
          <MessagesChargeCell
            id={row.original._id}
            entityName="messagesCharge"
            modalTitle="شارژ بسته پیامکی"
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
