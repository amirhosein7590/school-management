const addClassConfig = {
  inputs: {
    manager: [
      {
        type: "text",
        name: "name",
        placeholder: "نام کلاس",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا نام کلاس را وارد نمایید",
        },
      },
      {
        type: "number",
        name: "capacity",
        className: "!text-sm !rounded-[5px]",
        placeholder: "ظرفیت کلاس",
        rules: {
          required: "لطفا ظرفیت کلاس را وارد نمایید",
        },
      },
      {
        type: "select",
        name: "grade",
        placeholder: "پایه",
        className: "!w-full",
        multiple: false,
        options: [
          { label: "پایه اول", value: "1" },
          { label: "پایه دوم", value: "2" },
          { label: "پایه سوم", value: "3" },
          { label: "پایه چهارم", value: "4" },
          { label: "پایه پنجم", value: "5" },
          { label: "پایه ششم", value: "6" },
          { label: "پایه هفتم", value: "7" },
          { label: "پایه هشتم", value: "8" },
          { label: "پایه نهم", value: "9" },
          { label: "پایه دهم", value: "10" },
          { label: "پایه یازدهم", value: "11" },
          { label: "پایه دوازدهم", value: "12" },
        ],
        rules: {
          required: "لطفا پایه را وارد نمایید",
        },
      },
    ],
  },
  url: "/classes",
  method: "post",
  key: "classes",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "classes",
};

export default addClassConfig;
