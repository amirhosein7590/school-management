const checkOtpConfig = {
  inputs: {
    all: [
      {
        type: "text",
        name: "code",
        placeholder: "کد فعال سازی",
        rules: {
          required: "لطفا کد فعال سازی خود را وارد نمایید",
        },
        className:
          "mb-5 rounded-sm text-center text-sm md:text-[16px] py-3 md:py-5",
      },
    ],
  },
  url: "/auth/checkOtp",
  method: "post",
  headers: { "content-type": "application/json" },
  isPrivate: false,
  key: "checkOtp",
};

export default checkOtpConfig;
