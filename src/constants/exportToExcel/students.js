import dateToSolar from "@/utils/dateToSolar";
import ExcelJS from "exceljs";
import toPersianNumber from "@/utils/toPersianNumber";

export default async function exportStudentsToExcel(dataFn) {
  const data = dataFn()?.map((item) => ({
    fullName: `${item.firstName} ${item.lastName}`,
    parentPhone: toPersianNumber(item?.parentPhone),
    nationalCode: toPersianNumber(item?.nationalCode),
    birthDay: dateToSolar(item.birthDay),
    class: item?.class?.name ?? "",
  }));
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("دانش آموزان");
  worksheet.columns = [
    { header: "کلاس", key: "class", width: 20 },
    { header: "تاریخ تولد", key: "birthDay", width: 20 },
    { header: "کد ملی", key: "nationalCode", width: 20 },
    { header: "شماره تلفن", key: "parentPhone", width: 20 },
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
  a.download = "دانش آموزان.xlsx";
  a.click();
}
