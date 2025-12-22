const resetPasswordConfig = {
  inputs: [
    {
      type: "password",
      name: "newPassword",
      placeholder: "رمز عبور جدید",
      className: "mb-5 rounded-sm text-center text-sm md:text-md py-3 md:py-5",
      rules: {
        required: "لطفا رمز عبور جدید را وارد نمایید",
      },
    },
    {
      type: "password",
      name: "repeatPassword",
      placeholder: "تکرار رمز عبور",
      className: "mb-5 rounded-sm !text-md py-3 md:py-5",
      rules: {
        required: "لطفا تکرار رمز عبور را وارد نمایید",
      },
    },
  ],
  url: "/auth/resetPassword",
  method: "post",
  headers: { "content-type": "application/json" },
  isPrivate: false,
  key: "resetPassword",
};

export default resetPasswordConfig;
