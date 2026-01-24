const addStudentAttendanceConfig = {
  inputs: {
    teacher: [
      {
        type: "select",
        placeholder: "دانش آموز",
        name: "students",
        rules: {
          required: "دانش آموز انتخاب نشده است",
        },
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
        type: "datePicker",
        name: "date",
        placeholder: "تاریخ",
        className: "!text-sm !rounded-[5px] !text-sm",
        rules: { required: "لطفا تاریخ را وارد کنید" },
      },
      {
        type: "select",
        placeholder: "وضعیت حضور",
        name: "status",
        rules: {
          required: "وضعیت حضور انتخاب نشده است",
        },
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
      {
        type: "timePicker",
        name: "time",
        className: "!text-sm !rounded-[5px] !text-sm !ltr",
        placeholder: "ساعت",
      },
      {
        type: "text",
        name: "description",
        placeholder: "توضیحات",
        className: "!text-sm !rounded-[5px]",
      },
    ],
  },

  url: "/studentsAttendances",
  method: "post",
  key: "studentsAttendances",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "attendances",
};

export default addStudentAttendanceConfig;
