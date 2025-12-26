const getOtpConfig = {
  inputs: {
    all: [
      {
        type: "text",
        name: "userName",
        placeholder: "نام کاربری",
        rules: {
          required: "لطفا نام کاربری خود را وارد نمایید",
        },
        className:
          "mb-5 rounded-sm text-center text-sm md:text-[16px] py-3 md:py-5",
      },
    ],
  },
  url: "/auth/getOtp",
  method: "post",
  headers: { "content-type": "application/json" },
  isPrivate: false,
  key: "getOtp",
};

export default getOtpConfig;
