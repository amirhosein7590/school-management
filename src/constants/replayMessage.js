const replayMessageConfig = {
  inputs: {
    all: [
      {
        type: "textarea",
        name: "text",
        placeholder: "متن پاسخ را وارد کنید",
        rules: {
          required: "لطفا متن پاسخ را وارد کنید",
        },
        className: "!text-sm",
      },
    ],
  },
  url: "/messages/id/replay",
  method: "post",
  headers: { "content-type": "application/json" },
  deps: null,
  isPrivate: true,
  key: "messages",
};

export default replayMessageConfig;
