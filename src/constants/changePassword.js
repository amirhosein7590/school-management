const changePasswordConfig = {
  inputs: {
    all: [
      {
        type: "password",
        name: "oldPassword",
        placeholder: "رمز عبور فعلی",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا رمز عبور فعلی خود را وارد کنید",
        },
      },
      {
        type: "password",
        name: "newPassword",
        placeholder: "رمز عبور جدید",
        className: "!text-sm !rounded-none",
        rules: {
          required: "لطفا رمز عبور جدید خود را وارد کنید",
        },
      },
    ],
  },
  url: "/auth/changePassword",
  method: "post",
  key: "changePassword",
  deps: null,
  isPrivate: true,
  headers: { "content-type": "application/json" },
};

export default changePasswordConfig;
