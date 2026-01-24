import { Button } from "@/components/modules/Button/button";
import Form from "@/components/modules/Form";
import { Info } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

function Login() {
  const router = useRouter();
  const redirectToHome = () => {
    router.push("/school/home");
  };
  return (
    <div
      dir="rtl"
      className="wrapper bg-white flex w-full md:max-w-10/12 mx-auto shadow-sm mt-5 py-2 px-4 justify-between"
    >
      <div className="form flex flex-col w-full md:w-1/2">
        <div className="medad-info bg-white flex items-center pb-2 border-b border-b-[rgba(0_0_0_0.87)] card-shadow">
          <div className="w-8 ml-4 h-20 bg-[url('/images/logo.png')] bg-cover bg-center bg-no-repeat"></div>

          <div className="description flex flex-col -mr-2">
            <span className="sans-bold mb-1 text-sm md:text-[16px]">
              سامانه مداد
            </span>
            <span className="text-xs md:text-sm text-[rgba(0_0_0_.87)]">
              پیوند مدرسه با اولیا و دانش آموزان
            </span>
          </div>
        </div>
        <div className="title mb-6 md:mb-10 md:mr-6 sans-medium md:text-xl mt-3 md:mt-5">
          ورود به حساب کاربری
        </div>
        <Form
          submitButtonClassName="w-full md:text-[16px] rounded-full py-3 pb-4 md:py-4 md:pb-5 items-center justify-center"
          submitButtonText="ورود"
          mode="login"
          entityName="login"
          className="md:mr-6"
          afterSubmitFn={redirectToHome}
          clearFormButton={false}
        />
        <Button
          variant="link"
          href="/auth/forgotPassword"
          className="mt-3 text-right cursor-pointer text-xs md:text-sm"
        >
          رمز عبور خود را فراموش کرده اید ؟
        </Button>
        <p className="text-rose-600 text-xs md:text-[16px] flex md:items-center gap-x-2">
          <Info size={20} />
          به صورت پیش فرض نام کاربری کدملی و رمز عبور کد پرسنلی می باشد
        </p>
      </div>
      <div className="image hidden h-110 w-1/2 bg-no-repeat md:block bg-[url(/images/loginImage.png)]"></div>
    </div>
  );
}

export default Login;

Login.getLayout = (page) => <>{page}</>; // blank layout
