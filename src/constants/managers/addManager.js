const addManagerConfig = {
  inputs: {
    owner: [
      {
        type: "text",
        name: "firstName",
        placeholder: "نام",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا نام را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "lastName",
        className: "!text-sm !rounded-[5px]",
        placeholder: "نام خانوادگی",
        rules: {
          required: "لطفا نام خانوادگی را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "phone",
        placeholder: "شماره تلفن",
        className: "!text-sm !rounded-[5px]",
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
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا کد ملی را وارد نمایید",
        },
      },
      {
        type: "text",
        name: "personnelCode",
        placeholder: "کد پرسنلی",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا کد پرسنلی را وارد نمایید",
        },
      },
      {
        type: "select",
        name: "gender",
        placeholder: "جنسیت",
        className: "!text-sm !rounded-[5px] !w-full",
        options: [
          { label: "آقا", value: "male" },
          { label: "خانم", value: "female" },
        ],
        rules: {
          required: "لطفا جنسیت را وارد نمایید",
        },
      },
      {
        type: "datePicker",
        name: "birthDay",
        placeholder: "تاریخ تولد",
        className: "!text-sm !rounded-[5px] !text-sm",
        rules: { required: "لطفا تاریخ تولد را وارد کنید" },
      },
    ],
  },
  url: "/managers",
  method: "post",
  key: "managers",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "managers",
};

export default addManagerConfig;
