const searchTeacherReportConfig = {
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
        placeholder: "معلم",
        name: "teachers",
        className: "w-full",
        multiple: true,
        options: {
          url: "/teachers",
          method: "get",
          key: "teachers",
          deps: null,
          headers: null,
          isPrivate: true,
          optionsGenerator: (data) => {
            if (!data) return [];
            return data?.map((teacher) => ({
              label: `${teacher.firstName} ${teacher.lastName}`,
              value: teacher._id,
            }));
          },
          dataArrayName: "teachers",
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
  url: "/teachersAttendances/report",
  method: "post",
  key: "teachersAttendances/report",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "report",
};

export default searchTeacherReportConfig;
