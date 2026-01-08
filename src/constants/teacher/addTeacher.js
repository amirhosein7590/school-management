const addTeacherConfig = {
  inputs: {
    manager: [
      {
        type: "text",
        name: "firstName",
        placeholder: "نام معلم",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا نام معلم را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "lastName",
        className: "!text-sm !rounded-none",
        placeholder: "نام خانوادگی معلم",
        rules: {
          required: "لطفا نام خانوادگی معلم را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "phone",
        placeholder: "شماره تلفن معلم",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا شماره تلفن معلم را وارد کنید",
          pattern: {
            value: /^(?:\+?98|0)9\d{9}$/,
            message: "شماره تلفن نا معتبر است",
          },
        },
      },
      {
        type: "text",
        name: "nationalCode",
        placeholder: "کد ملی معلم",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا کد ملی معلم را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "personnelCode",
        placeholder: "کد پرسنلی معلم",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا کد پرسنلی معلم را وارد نمایید",
        },
      },
      {
        type: "select",
        name: "gender",
        placeholder: "جنسیت معلم",
        className: "!text-sm !rounded-none !w-full",
        options: [
          { label: "مرد", value: "male" },
          { label: "زن", value: "female" },
        ],
        rules: {
          required: "لطفا جنسیت معلم را وارد نمایید",
        },
      },
      {
        type: "datePicker",
        name: "birthDay",
        placeholder: "تاریخ تولد معلم",
        className: "!text-sm !rounded-none",
        rules: { required: "لطفا تاریخ تولد معلم را وارد کنید" },
      },
    ],
  },
  url: "/teachers",
  method: "post",
  key: "teachers",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
};

export default addTeacherConfig;
