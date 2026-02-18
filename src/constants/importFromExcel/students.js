import ExcelJS from "exceljs";
import { toGregorian } from "jalaali-js";
import persianJs from "persianjs";

const studentValidationSchema = {
  نام: {
    key: "firstName",
    validator: (v) => String(v)?.trim?.()?.length > 0,
  },
  "نام خانوادگی": {
    key: "lastName",
    validator: (v) => String(v)?.trim?.()?.length > 0,
  },
  "شماره تلفن والد": {
    key: "parentPhone",
    validator: (v) => /^(?:\+?98|0)[۰-۹0-9]{10}$/.test(v),
  },
  "کد ملی": {
    key: "nationalCode",
    validator: (v) => String(v)?.trim?.()?.length > 0,
  },
  "تاریخ تولد": {
    key: "birthDay",
    validator: (v) => {
      if (!v) return false;
      const [year, mounth, day] = v.split("/");
      const formatedYear = Number(persianJs(year).toEnglishNumber().toString());
      const formatedMounth = Number(
        persianJs(mounth).toEnglishNumber().toString(),
      );
      const formatedDay = Number(persianJs(day).toEnglishNumber().toString());
      const isInvalidDate =
        new Date(`${formatedYear}/${formatedMounth}/${formatedDay}`) ==
        "Invalid Date";
      if (isInvalidDate) {
        return false;
      } else {
        return true;
      }
    },
  },

  پایه: {
    key: "grade",
    validator: (v) => {
      if (isNaN(Number(v))) return false;
      if (Number(v) > 12 || Number(v) < 1) return false;
      return true;
    },
  },
};

export default async function importStudentsFromExcel(file) {
  if (!file) return;
  const workbook = new ExcelJS.Workbook();
  const result = await workbook.xlsx.load(file);
  const worksheet = result.getWorksheet(1);

  const headers = worksheet.getRow(1)?.values?.filter((h) => h);
  if (!headers || headers.length === 0) {
    return { data: [], errors: ["فایل اکسل خالی است یا ردیف اول وجود ندارد."] };
  }

  const students = [];
  const errors = [];

  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    const rowValues = row.values?.filter((r) => r);

    const student = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const key = Object.keys(studentValidationSchema).find(
        (k) => k === header,
      );

      if (!key) {
        errors.push(`هدر "${header}"در فایل تعریف نشده است.`);
        continue;
      }

      const value = rowValues[j];
      const validator = studentValidationSchema[key].validator;

      if (validator && !validator(value)) {
        errors.push(`فیلد ${key} در ردیف ${i} نامعتبر است`);
        break;
      }

      if (header?.trim() == "تاریخ تولد") {
        const [year, mounth, day] = value?.split("/");
        const formatedYear = Number(
          persianJs(year).toEnglishNumber().toString(),
        );
        const formatedMounth = Number(
          persianJs(mounth).toEnglishNumber().toString(),
        );
        const formatedDay = Number(persianJs(day).toEnglishNumber().toString());
        const { gy, gm, gd } = toGregorian(
          formatedYear,
          formatedMounth,
          formatedDay,
        );

        const date = new Date(`${gy}/${gm}/${gd}`).toISOString();

        student[studentValidationSchema[key].key] = date;
      } else {
        student[studentValidationSchema[key].key] = value;
      }
    }

    students.push(student);
  }

  return { data: students, errors };
}
