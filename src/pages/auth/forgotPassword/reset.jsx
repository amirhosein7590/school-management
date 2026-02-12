import { Button } from "@/components/modules/Button/button";
import Form from "@/components/modules/Form";
import useAuthStore from "@/store/authStore";
import React, { memo, useEffect, useState } from "react";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { Spinner } from "@/components/modules/spinner";
import Steper from "@/components/templates/ForgotPassword/steper";
import { toast } from "sonner";
import { useRouter } from "next/router";
import pageNameHandler from "@/utils/pageNameHandler";

function Reset() {
  const phone = useAuthStore((s) => s.phone);
  const userName = useAuthStore((s) => s.userName);
  const setResetToken = useAuthStore((s) => s.setResetToken);
  const resetToken = useAuthStore((s) => s.resetToken);
  const [currentStep, setCurrentStep] = useState(2);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    pageNameHandler(null, "بازیابی رمز عبور");
  }, []);

  const { mutate, isPending } = useCustomeMutation(
    "getOtp",
    null,
    "/auth/getOtp",
    { "content-type": "application/json" },
    "post",
    false,
  );
  const router = useRouter();

  const sendOtp = async () => {
    if (!userName) {
      toast.error("لطفا نام کاربری را مجددا وارد کنید");
    }
    mutate(
      { userName },
      {
        onSuccess: (response) => {
          setTimer(60);
          setResetToken(response.resetToken);
        },
      },
    );
  };
  const checkOtpAfterSubmit = (result) => {
    setResetToken(result.resetToken);
    setCurrentStep(3);
  };

  const resetPasswordAfterSubmit = (result) => {
    router.push("/auth/login");
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col md:max-w-10/12 md:mx-auto mt-4 w-full"
    >
      <Steper currentStep={currentStep} className="mb-2" />
      <div className="form-wrapper bg-white shadow-sm flex flex-col py-2 px-4">
        {currentStep == 2 ? (
          <>
            <p className="description mt-5 mb-15 text-sm md:text-[16px]">
              {`برای تغییر رمز عبور ، لطفا کد ارسال شده به شماره ${phone} را در کادر زیر وارد نمایید`}
            </p>
            <Form
              entityName="checkOtp"
              submitButtonClassName="flex justify-center w-65 pb-3 rounded-full items-center"
              submitButtonText="تایید کد فعال سازی"
              className="w-full md:w-4/12 md:mx-auto mb-1 flex flex-col items-center"
              afterSubmitFn={checkOtpAfterSubmit}
              clearFormButton={false}
            />
            {timer > 0 ? (
              <p className="text-center text-[var(--light-blue)] text-xs md:text-sm ">
                ارسال مجدد کد تا {timer} ثانیه دیگر
              </p>
            ) : (
              <div className="resent-code-button-container flex justify-center items-center">
                {" "}
                <Button
                  variant="ghost"
                  onClick={sendOtp}
                  className="flex justify-center cursor-pointer items-center text-xs md:text-sm text-[var(--light-blue)]"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Spinner size="sm" />
                  ) : (
                    "ارسال مجدد کد فعال سازی"
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="description mt-5 mb-15 text-sm md:text-[16px]">
              لطفا اطلاعات زیر را جهت تغییر رمز عبور تکمیل کنید
            </p>
            <Form
              entityName="resetPassword"
              submitButtonClassName="flex justify-center w-65 pb-3 rounded-full items-center"
              submitButtonText="تغییر رمز عبور"
              className="w-full md:w-4/12 md:mx-auto mb-5 flex flex-col items-center"
              afterSubmitFn={resetPasswordAfterSubmit}
              bodyReq={{ resetToken }}
              clearFormButton={false}
            />
          </>
        )}
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/login")}
          className="flex justify-center mt-5 items-center text-xs md:text-sm text-[var(--light-blue)]"
        >
          بازگشت به صفحه ورود
        </Button>
      </div>
    </div>
  );
}

export default memo(Reset);
