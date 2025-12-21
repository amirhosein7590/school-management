const loginFormConfig = {
  inputs: [
    {
      type: "text",
      name: "userName",
      placeholder : "نام کاربری",
      className:"mb-5 rounded-sm text-sm md:text-md py-3 md:py-5",
      rules: {
        required: "لطفا نام کاربری را وارد نمایید",
      },
    },
    {
      type: "password",
      name: "password",
      placeholder : "رمز عبور",
      className : "mb-5 rounded-sm !text-md py-3 md:py-5",
      rules: {
        required: "لطفا رمز عبور را وارد نمایید",
      },
    },
  ],
  url: "/auth/login",
  method: "post",
  headers: { "content-type": "application/json" },
  isPrivate: false,
  key: "login",
};

export default loginFormConfig;
