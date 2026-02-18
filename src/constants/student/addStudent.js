const addStudentsConfig = {
  inputs: {
    manager: [
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
        name: "parentPhone",
        placeholder: "شماره تلفن والد",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا شماره تلفن والد را وارد کنید",
          pattern: {
            value: /^(?:\+?98|0)[۰-۹0-9]{10}$/,
            message: "شماره تلفن والد نا معتبر است",
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
        type: "datePicker",
        name: "birthDay",
        placeholder: "تاریخ تولد",
        className: "!text-sm !rounded-[5px] !text-sm",
        rules: { required: "لطفا تاریخ تولد را وارد کنید" },
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
          ,
        ],
        rules: {
          required: "لطفا پایه را وارد نمایید",
        },
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
  url: "/students",
  method: "post",
  key: "students",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "students",
};

export default addStudentsConfig;
