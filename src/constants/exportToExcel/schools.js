import ExcelJS from "exceljs";
import persianJs from "persianjs";

const genderLabels = {
  boyish: "پسرانه",
  girlish: "دخترانه",
  mixed: "مختلط",
};

export default async function exportSchoolsToExcel(dataFn) {
  const data = dataFn()?.map((school) => ({
    name: school.name,
    address: school.address,
    level: school.level == "1" ? "دوره اول" : "دوره دوم",
    shift: school.shift == "morning" ? "صبح" : "عصر",
    phone: persianJs(school.phone).persianNumber()._str,
    gender: genderLabels[school.gender],
    manager: `${school?.manager?.firstName ?? ""} ${school?.manager?.lastName ?? ""}`,
  }));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("مدارس");
  worksheet.views = [{ rightToLeft: false }];

  worksheet.columns = [
    { header: "مدیر مدرسه", key: "manager", width: 20 },
    { header: "جنسیت مدرسه", key: "gender", width: 20 },
    { header: "شماره تلفن مدرسه", key: "phone", width: 20 },
    { header: "شیفت مدرسه", key: "shift", width: 20 },
    { header: "دوره مدرسه", key: "level", width: 20 },
    { header: "آدرس مدرسه", key: "address", width: 20 },
    { header: "نام مدرسه", key: "name", width: 35 },
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
  a.download = "مدارس.xlsx";
  a.click();
}
