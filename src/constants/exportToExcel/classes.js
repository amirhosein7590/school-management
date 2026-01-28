import toPersianNumber from "@/utils/toPersianNumber";
import ExcelJS from "exceljs";

export default async function exportClassesToExcel(dataFn) {
  const gradeLabels = {
    1: "اول",
    2: "دوم",
    3: "سوم",
    4: "چهارم",
    5: "پنجم",
    6: "ششم",
    7: "هفتم",
    8: "هشتم",
    9: "نهم",
    10: "دهم",
    11: "یازدهم",
    12: "دوازدهم",
  };
  const data = dataFn()?.map((item) => ({
    name: item.name,
    teacher: `${item?.teacher?.firstName ?? ""} ${item?.teacher?.lastName ?? ""}`,
    capacity: toPersianNumber(item.capacity),
    grade: gradeLabels?.[item.grade],
  }));
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("کلاس ها");
  worksheet.columns = [
    { header: "پایه", key: "grade", width: 15 },
    { header: "ظرفیت", key: "capacity", width: 15 },
    { header: "معلم", key: "teacher", width: 15 },
    { header: "نام", key: "name", width: 30 },
  ];

  worksheet.views = [{ showGridLines: true }];

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
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = {
        size: 14,
        name: "B Nazanin",
      };
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
  a.download = "کلاس ها.xlsx";
  a.click();
}
