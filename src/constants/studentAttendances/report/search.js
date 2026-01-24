const searchStudentReportConfig = {
  inputs: {
    manager: [
      {
        type: "datePicker",
        name: "fromDate",
        placeholder: "تاریخ شروع",
        className: "!text-sm !rounded-[5px] !text-sm",
        rules: { required: "لطفا تاریخ شروع را وارد کنید" },
      },
      {
        type: "datePicker",
        name: "toDate",
        placeholder: "تاریخ پایان",
        className: "!text-sm !rounded-[5px] !text-sm",
        rules: { required: "لطفا تاریخ پایان را وارد کنید" },
      },
      {
        type: "select",
        placeholder: "دانش آموز",
        name: "students",
        className: "w-full",
        multiple: true,
        options: {
          url: "/students",
          method: "get",
          key: "students",
          deps: null,
          headers: null,
          isPrivate: true,
          optionsGenerator: (data) => {
            if (!data) return [];
            return data?.map((student) => ({
              label: `${student.firstName} ${student.lastName}`,
              value: student._id,
            }));
          },
          dataArrayName: "students",
        },
      },
      {
        type: "select",
        placeholder: "وضعیت حضور",
        name: "status",
        className: "w-full",
        multiple: false,
        options: [
          { label: "حاضر", value: "present" },
          { label: "غیبت غیر موجه", value: "absent" },
          { label: "غیبت موجه", value: "excused" },
          { label: "تاخیر", value: "late" },
          { label: "سایر", value: "other" },
        ],
      },
    ],
    teacher: [
      {
        type: "datePicker",
        name: "fromDate",
        placeholder: "تاریخ شروع",
        className: "!text-sm !rounded-[5px] !text-sm",
        rules: { required: "لطفا تاریخ شروع را وارد کنید" },
      },
      {
        type: "datePicker",
        name: "toDate",
        placeholder: "تاریخ پایان",
        className: "!text-sm !rounded-[5px] !text-sm",
        rules: { required: "لطفا تاریخ پایان را وارد کنید" },
      },
      {
        type: "select",
        placeholder: "دانش آموز",
        name: "students",
        className: "w-full",
        multiple: true,
        options: {
          url: "/students",
          method: "get",
          key: "students",
          deps: null,
          headers: null,
          isPrivate: true,
          optionsGenerator: (data) => {
            if (!data) return [];
            return data?.map((student) => ({
              label: `${student.firstName} ${student.lastName}`,
              value: student._id,
            }));
          },
          dataArrayName: "students",
        },
      },
      {
        type: "select",
        placeholder: "وضعیت حضور",
        name: "status",
        className: "w-full",
        multiple: false,
        options: [
          { label: "حاضر", value: "present" },
          { label: "غیبت غیر موجه", value: "absent" },
          { label: "غیبت موجه", value: "excused" },
          { label: "تاخیر", value: "late" },
          { label: "سایر", value: "other" },
        ],
      },
    ],
  },
  url: "/studentsAttendances/report",
  method: "post",
  key: "studentsAttendances/report",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "report",
};

export default searchStudentReportConfig;
