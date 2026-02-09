import ExcelJS from "exceljs";
import { toGregorian } from "jalaali-js";
import persianJs from "persianjs";

const teacherValidationSchema = {
  نام: {
    key: "firstName",
    validator: (v) => String(v)?.trim?.()?.length > 0,
  },
  "نام خانوادگی": {
    key: "lastName",
    validator: (v) => String(v)?.trim?.()?.length > 0,
  },
  "شماره تلفن": {
    key: "phone",
    validator: (v) => /^(?:\+?98|0)9\d{9}$/.test(v),
  },
  "کد ملی": {
    key: "nationalCode",
    validator: (v) => String(v)?.trim?.()?.length > 0,
  },
  "کد پرسنلی": {
    key: "personnelCode",
    validator: (v) => String(v)?.trim?.()?.length > 0,
  },
  جنسیت: {
    key: "gender",
    validator: (v) => {
      if (v?.trim()?.length < 1) return false;
      const validGenders = ["آقا", "خانم"];
      if (!validGenders.includes(v?.trim())) {
        return false;
      }
      return true;
    },
  },
  "تاریخ تولد": {
    key: "birthDay",
    validator: (v) => {
      if (!v) return false;
      const [year, mounth, day] = v.split("/");
      if (isNaN(year) || isNaN(mounth) || isNaN(day)) return false
      const formatedYear = Number(persianJs(year).toEnglishNumber().toString());
      const formatedMounth = Number(
        persianJs(mounth).toEnglishNumber().toString(),
      );
      const formatedDay = Number(persianJs(day).toEnglishNumber().toString());
      const isInvalidDate = new Date(`${formatedYear}/${formatedMounth}/${formatedDay}`) == "Invalid Date";
      if (isInvalidDate) {
        return false;
      } else {
        return true;
      }
    },
  },
};

export default async function importTeachersFromExcel(file) {
  if (!file) return;
  const workbook = new ExcelJS.Workbook();
  const result = await workbook.xlsx.load(file);
  const worksheet = result.getWorksheet(1);

  const headers = worksheet.getRow(1)?.values?.filter((h) => h);
  if (!headers || headers.length === 0) {
    return { data: [], errors: ["فایل اکسل خالی است یا ردیف اول وجود ندارد."] };
  }

  const teachers = [];
  const errors = [];

  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    const rowValues = row.values?.filter((r) => r);

    const teacher = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const key = Object.keys(teacherValidationSchema).find(
        (k) => k === header,
      );

      if (!key) {
        errors.push(`هدر "${header}" در فایل تعریف نشده است.`);
        continue;
      }

      const value = rowValues[j];
      const validator = teacherValidationSchema[key].validator;

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

        teacher[teacherValidationSchema[key].key] = date;
      } else if (header == "جنسیت") {
        const formatedValue = value == "خانم" ? "female" : "male";
        teacher[teacherValidationSchema[key].key] = formatedValue;
      } else {
        teacher[teacherValidationSchema[key].key] = String(value);
      }
    }

    teachers.push(teacher);
  }

  return { data: teachers, errors };
}
