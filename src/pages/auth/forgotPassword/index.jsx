import { Button } from "@/components/modules/Button/button";
import Form from "@/components/modules/Form";
import Steper from "@/components/templates/ForgotPassword/steper";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/router";
import React, { memo } from "react";

function ForgotPassword() {
  const router = useRouter();
  const setPhone = useAuthStore((s) => s.setPhone);
  const setUserName = useAuthStore((s) => s.setUserName);
  const afterSubmitFn = (result) => {
    setPhone(result.phone);
    setUserName(result.userName);
    router.push("/auth/forgotPassword/reset");
  };

  return (
    <div dir="rtl" className="flex flex-col md:max-w-10/12 md:mx-auto mt-4 w-full">
      <Steper currentStep={1} className="mb-2" />
      <div className="form-wrapper bg-white shadow-sm flex flex-col py-2 px-4">
        <p className="description mt-5 mb-15 text-sm md:text-[16px]">
          جهت بازیابی لطفا نام کاربری خود را وارد نمایید:
        </p>

        <Form
          entityName="getOtp"
          submitButtonClassName="flex justify-center w-65 pb-3 rounded-full items-center"
          submitButtonText="دریافت کد بازیابی رمز عبور"
          className="w-full md:w-4/12 md:mx-auto mb-5 flex flex-col items-center"
          afterSubmitFn={afterSubmitFn}
          clearFormButton={false}
        />
        <Button
          variant="ghost"
          href="/auth/login"
          className="text-[var(--light-blue)] text-xs md:text-sm flex justify-center items-center"
        >
          بازگشت به صفحه ورود
        </Button>
      </div>
    </div>
  );
}


export default ForgotPassword;


