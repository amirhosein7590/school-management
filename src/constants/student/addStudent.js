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
            value: /^(?:\+?98|0)9\d{9}$/,
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
