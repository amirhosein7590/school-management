const addSchoolConfig = {
  inputs: {
    owner: [
      {
        type: "text",
        name: "name",
        placeholder: "نام مدرسه",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا نام مدرسه را وارد کنید",
          pattern: {
            value: /^[\u0600-\u06FF0-9۰-۹ ]{3,}$/,
            message: "نام مدرسه باید با حروف فارسی و بیشتر از سه حرف باشد",
          },
        },
      },
      {
        type: "text",
        name: "address",
        placeholder: "آدرس مدرسه",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا آدرس مدرسه را وارد کنید",
          pattern: {
            value: /^[\u0600-\u06FF0-9۰-۹\-\/() ]{3,}$/,
            message: "آدرس مدرسه باید با حروف فارسی و بیش از 3 حرف باشد",
          },
        },
      },
      {
        type: "select",
        name: "level",
        placeholder: "دوره مدرسه",
        className: "!text-sm !rounded-[5px] !w-full",
        multiple: false,
        options: [
          { label: "دوره اول", value: "1" },
          { label: "دوره دوم", value: "2" },
        ],
        rules: {
          required: "لطفا دوره مدرسه را وارد کنید",
        },
      },
      {
        type: "select",
        name: "shift",
        multiple: false,
        placeholder: "شیفت مدرسه",
        className: "!text-sm !rounded-[5px] !w-full",
        options: [
          { label: "شیفت صبح", value: "morning" },
          { label: "شیفت عصر", value: "evening" },
        ],
        rules: {
          required: "لطفا شیفت مدرسه را وارد کنید",
        },
      },
      {
        type: "select",
        name: "gender",
        placeholder: "پسرانه / دخترانه",
        multiple: false,
        className: "!text-sm !rounded-[5px] !w-full",
        options: [
          { label: "پسرانه", value: "boyish" },
          { label: "دخترانه", value: "girlish" },
          { label: "مختلط", value: "mixed" },
        ],
        rules: {
          required: "لطفا دوره مدرسه را وارد کنید",
        },
      },
      {
        type: "text",
        name: "phone",
        placeholder: "شماره مدرسه",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا شماره مدرسه را وارد کنید",
          pattern: {
            value: /^[\d۰-۹]{11,}$/,
            message: "شماره تلفن باید با پیش شماره و 11 رقم باشد",
          },
        },
      },
    ],
  },
  url: "/schools",
  method: "post",
  key: "schools",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "schools",
};

export default addSchoolConfig;
