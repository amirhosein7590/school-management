import dateToSolar from "@/utils/dateToSolar";
import toPersianNumber from "@/utils/toPersianNumber";
import ExcelJS from "exceljs";

const showDateHandler = (date) => {
  const originalTime = new Date(date).getTime();
  const formatedDate = new Date(originalTime + 16400000);
  return dateToSolar(formatedDate);
};

const statusAttendanceConfig = {
  present: {
    text: "حاضر",
  },
  absent: {
    text: "غیبت غیر موجه",
  },
  excused: {
    text: "غیبت موجه",
  },
  late: {
    text: "تاخیر",
  },
  other: {
    text: "سایر",
  },
};

export default async function exportStudentAttendancesToExcel(dataFn) {
  const data = dataFn()?.map((item) => ({
    fullName: `${item?.student?.firstName ?? "حذف شده"} ${item?.student?.lastName ?? ""}`,
    class: item?.class?.name ?? "",
    status: statusAttendanceConfig[item?.status]?.text,
    date: showDateHandler(item?.date),
    time: toPersianNumber(item?.time) ?? "",
    description: item?.description ?? "",
  }));
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("حضور و غیاب دانش آموزان");
  worksheet.columns = [
    { header: "توضیحات", key: "description", width: 40 },
    { header: "ساعت", key: "time", width: 20 },
    { header: "تاریخ", key: "date", width: 20 },
    { header: "وضعیت حضور", key: "status", width: 20 },
    { header: "کلاس", key: "class", width: 20 },
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
  a.download = "حضور و غیاب دانش آموزان.xlsx";
  a.click();
}
