const addTeacherConfig = {
  inputs: {
    manager: [
      {
        type: "text",
        name: "firstName",
        placeholder: "نام",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا نام را وارد نمایید",
          pattern: {
            value: /^[\u0600-\u06FF ]{3,}$/,
            message: "نام باید با حروف فارسی و بیشتر از سه حرف باشد",
          },
        },
      },
      {
        type: "text",
        name: "lastName",
        className: "!text-sm !rounded-[5px]",
        placeholder: "نام خانوادگی",
        rules: {
          required: "لطفا نام خانوادگی را وارد نمایید",
          pattern: {
            value: /^[\u0600-\u06FF ]{3,}$/,
            message: "نام خانوادگی باید با حروف فارسی و بیشتر از سه حرف باشد",
          },
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
            value: /^0[0-9]{10}$/,
            message: "شماره تلفن نا معتبر است",
          },
        },
      },
      {
        type: "text",
        name: "nationalCode",
        placeholder: "کد ملی (ده رقم)",
        className: "!text-sm !rounded-[5px]",
        maxLength: 10,
        rules: {
          required: "لطفا کد ملی را وارد نمایید",
          pattern: {
            value: /^[0-9۰-۹]{10}$/,
            message: "کد ملی نامعتبر است",
          },
        },
      },
      {
        type: "text",
        name: "personnelCode",
        placeholder: "کد پرسنلی",
        maxLength: 10,
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا کد پرسنلی را وارد نمایید",
          pattern: {
            value: /^[0-9۰-۹]{1,10}$/,
            message: "کد پرسنلی نامعتبر است",
          },
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
      {
        type: "select",
        name: "class",
        placeholder: "کلاس (اختیاری)",
        className: "w-full",
        multiple: false,
        options: {
          url: "/classes",
          method: "get",
          key: "classes",
          deps: null,
          headers: null,
          isPrivate: true,
          optionsGenerator: (data) => {
            if (!data || !data) return [];
            return data?.map((cls) => ({
              label: `${cls.name}`,
              value: cls._id,
            }));
          },
          dataArrayName: "classes",
        },
      },
    ],
  },
  url: "/teachers",
  method: "post",
  key: "teachers",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "teachers",
};

export default addTeacherConfig;
