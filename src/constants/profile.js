const baseInputs = [
  {
    type: "text",
    name: "firstName",
    placeholder: "نام",
    className: "!text-sm !rounded-none",
    rules: { required: "لطفا نام را وارد کنید" },
  },
  {
    type: "text",
    name: "lastName",
    placeholder: "نام خانوادگی",
    className: "!text-sm !rounded-none",
    rules: { required: "لطفا نام خانوادگی را وارد کنید" },
  },
  {
    type: "text",
    name: "userName",
    placeholder: "نام کاربری",
    className: "!text-sm !rounded-none",
    rules: { required: "لطفا نام کاربری را وارد کنید" },
  },
  {
    type: "text",
    name: "phone",
    placeholder: "شماره تلفن",
    className: "!text-sm !rounded-none",
    rules: {
      required: "لطفا شماره تلفن را وارد کنید",
      pattern: {
        value: /^(?:\+?98|0)9\d{9}$/,
        message: "شماره تلفن نا معتبر است",
      },
    },
  },
  {
    type: "text",
    name: "nationalCode",
    placeholder: "کد ملی",
    className: "!text-sm !rounded-none",
    rules: { required: "لطفا کد ملی را وارد کنید" },
  },
];

const profileConfig = {
  inputs: {
    manager: [
      ...baseInputs,
      {
        type: "text",
        name: "personnelCode",
        placeholder: "کد پرسنلی",
        className: "!text-sm !rounded-none",
        rules: { required: "لطفا کد پرسنلی را وارد کنید" },
      },
    ],
    teacher: [
      ...baseInputs,
      {
        type: "text",
        name: "personnelCode",
        placeholder: "کد پرسنلی",
        className: "!text-sm !rounded-none",
        rules: { required: "لطفا کد پرسنلی را وارد کنید" },
      },
      {
        type: "datePicker",
        name: "birthDay",
        placeholder: "تاریخ تولد",
        className: "!text-sm !rounded-none",
        rules: { required: "لطفا تاریخ تولد را وارد کنید" },
      },
    ],
    owner: [...baseInputs],
    url: "/me",
    method: "get",
    key: "me",
    deps: null,
    isPrivate: true,
    headers: null,
    dataProp: "user",
  },
  url: "/auth/profile",
  method: "post",
  key: "profile",
  deps: null,
  isPrivate: true,
  headers: { "content-type": "application/json" },
};

export default profileConfig;
