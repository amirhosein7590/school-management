const messagesChargeConfig = {
  inputs: {
    owner: [
      {
        type: "number",
        name: "count",
        placeholder: "مقدار پیامک",
        className: "!text-sm !rounded-[5px]",
        rules: {
          required: "لطفا مقدار پیامک را وارد نمایید",
          pattern: {
            value: /[0-9]/,
            message: "مقدار وارد شده نامعتبر است",
          },
        },
      },
    ],
  },
  url: "/managers/id/messagesCharge",
  method: "post",
  key: "managers",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
};

export default messagesChargeConfig;
