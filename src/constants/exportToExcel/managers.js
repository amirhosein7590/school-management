import dateToSolar from "@/utils/dateToSolar";
import ExcelJS from "exceljs";
import persianJs from "persianjs";

export default async function exportManagersToExcel(dataFn) {
  const data = dataFn()?.map((item) => ({
    fullName: `${item.firstName} ${item.lastName}`,
    phone: persianJs(item?.phone).persianNumber().toString(),
    nationalCode: persianJs(item?.nationalCode).persianNumber().toString(),
    personnelCode: persianJs(item?.personnelCode).persianNumber().toString(),
    gender: item?.gender == "male" ? "آقا" : "خانم",
    birthDay: dateToSolar(item.birthDay),
    isBanned: item?.isBanned ? "مسدود" : "فعال",
  }));
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("مدیران");
  worksheet.views = [{ rightToLeft: false }];

  worksheet.columns = [
    { header: "وضعیت مسدودیت", key: "isBanned", width: 20 },
    { header: "تاریخ تولد", key: "birthDay", width: 20 },
    { header: "جنسیت", key: "gender", width: 20 },
    { header: "کد پرسنلی", key: "personnelCode", width: 20 },
    { header: "کد ملی", key: "nationalCode", width: 20 },
    { header: "شماره تلفن", key: "phone", width: 20 },
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
  a.download = "مدیران.xlsx";
  a.click();
}
