const addNotificationConfig = {
  inputs: {
    owner: [
      {
        type: "textarea",
        name: "text",
        placeholder: "متن اعلان",
        className: "!text-sm !rounded-[5px] w-full",
        rules: {
          required: "لطفا متن اعلان را وارد کنید",
        },
      },
      {
        type: "select",
        name: "status",
        placeholder: "وضعیت اعلان",
        className: "!text-sm !rounded-[5px] w-full lg:w-1/2",
        rules: {
          required: "لطفا وضعیت اعلان را وارد کنید",
        },
        options: [
          { label: "خطا", value: "error" },
          { label: "هشدار", value: "warning" },
          { label: "موفق", value: "success" },
          { label: "اطلاع", value: "info" },
        ],
      },
      {
        type: "select",
        name: "receiver",
        placeholder: "گیرنده",
        className: "!text-sm !rounded-[5px] w-full lg:w-[49%]",
        multiple: true,
        options: {
          url: "/managers",
          method: "get",
          key: "managers",
          deps: null,
          headers: null,
          isPrivate: true,
          optionsGenerator: (data) => {
            if (!data) return [];
            const managers = data?.map((manager) => ({
              label: `${manager.firstName} ${manager.lastName}`,
              value: manager._id,
            }));
            return [{ label: "همه", value: "all" }, ...managers];
          },
          dataArrayName: "managers",
        },
        rules: {
          required: "لطفا گیرنده را وارد کنید",
        },
      },
    ],
  },
  url: "/notifications",
  method: "post",
  key: "notifications",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  dataArrayName: "notifications",
};

export default addNotificationConfig;
