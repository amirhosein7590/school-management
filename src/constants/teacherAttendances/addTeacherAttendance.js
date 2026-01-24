const addTeacherAttendanceConfig = {
  inputs: {
    manager: [
      {
        type: "select",
        placeholder: "معلم",
        name: "teachers",
        rules: {
          required: "معلم انتخاب نشده است",
        },
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

  url: "/teachersAttendances",
  method: "post",
  key: "teachersAttendances",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "attendances",
};

export default addTeacherAttendanceConfig;
