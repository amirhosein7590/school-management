const suggestConfig = {
  inputs: {
    all: [
      {
        type: "select",
        name: "subject",
        multiple: false,
        className: "w-full my-5",
        rules: { required: "لطفا نوع بازخورد را مشخص کنید" },
        placeholder: "نوع بازخورد",
        options: [
          { label: "گزارش اشکال در نرم افزار", value: "problem" },
          { label: "پیشنهادی برای بهبود", value: "suggest" },
          { label: "سایر", value: "other" },
        ],
      },
      {
        type: "textarea",
        name: "text",
        className: "text-sm",
        rules: {
          required: "لطفا توضیحات را وارد کنید",
        },
        placeholder:
          "لطفا نظرات ، انتقادات و پیشنهادات خود را در رابطه با عملکرد سامانه مداد ، با ما در میان بگذارید ... ",
        labels: [
          {
            name: "description",
            className: "text-gray-400 text-xs mb-1",
            position: "before",
            text: "توضیحات",
          },
          {
            name: "opinion",
            className: "text-gray-400 text-xs mt-3",
            position: "after",
            text: "نظرات شما برای ما بسیار با ارزش است",
          },
        ],
      },
    ],
  },
  url: "/suggests",
  method: "post",
  headers: { "content-type": "application/json" },
  isPrivate: true,
  key: "suggest",
};

export default suggestConfig;
