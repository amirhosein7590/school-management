import dateToSolar from "@/utils/dateToSolar";
import ExcelJS from "exceljs";
import persianJs from "persianjs";

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

export default async function exportTeacherAttendancesToExcel(dataFn) {
  const data = dataFn()?.map((item) => ({
    fullName: `${item?.teacher?.firstName ?? "حذف شده"} ${item?.teacher?.lastName ?? ""}`,
    status: statusAttendanceConfig[item?.status]?.text,
    date: showDateHandler(item?.date),
    time: item?.time ? persianJs(item.time).persianNumber().toString() : "",
    description: item?.description ?? "",
  }));
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("حضور و غیاب معلمان");
  worksheet.views = [{ rightToLeft: false }];

  worksheet.columns = [
    { header: "توضیحات", key: "description", width: 40 },
    { header: "ساعت", key: "time", width: 20 },
    { header: "تاریخ", key: "date", width: 20 },
    { header: "وضعیت حضور", key: "status", width: 20 },
    { header: "نام و نام خانوادگی", key: "fullName", width: 35 },
  ];

  // header cell style

  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    cell.font = {
      color: { argb: "FFFFFFFF" },
      bold: true,
      size: 16,
      name: "B titr",
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // generate data cells and style

  data.forEach((item, index) => {
    const row = worksheet.addRow(item);
    const fillColor = index % 2 === 0 ? "FFF2F2F2" : "FFFFFFFF";

    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fillColor },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.font = {
        size: 14,
        name: "B Nazanin",
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });

  // save file

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "حضور و غیاب معلمان.xlsx";
  a.click();
}
