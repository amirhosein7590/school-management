import { Check } from "lucide-react";
import React, { memo } from "react";

function Steper({ currentStep = 1, className }) {
  return (
    <div
      className={`py-4 px-6 shadow-sm bg-white flex items-center gap-x-2 md:gap-x-5 ${className}`}
    >
      <div className="step-1 flex items-center gap-x-2">
        <span
          className={`number flex justify-center items-center rounded-full text-white w-5 h-5 py-1 px-1 text-sm ${
            currentStep == 1 ? "bg-[#009688] " : "bg-[#00000061]"
          }`}
        >
          {currentStep > 1 ? <Check color="white" /> : "1"}
        </span>
        <span
          className={`text hidden md:block text-sm text-nowrap ${
            currentStep == 1 ? "text-black" : "text-[#00000061]"
          }`}
        >
          نام کاربری
        </span>
      </div>
      <hr className="self-center border w-4/12" />
      <div className="step-2 flex items-center gap-x-2">
        <span
          className={`number flex justify-center items-center rounded-full text-white w-5 h-5 py-1 px-1 text-sm ${
            currentStep == 2 ? "bg-[#009688] " : "bg-[#00000061]"
          }`}
        >
          {currentStep > 2 ? <Check color="white" /> : "2"}
        </span>
        <span
          className={`text hidden md:block text-sm text-nowrap ${
            currentStep == 2 ? "text-black" : "text-[#00000061]"
          }`}
        >
          تایید کد فعال سازی
        </span>
      </div>
      <hr className="self-center border w-4/12" />
      <div className="step-3 flex items-center gap-x-2">
        <span
          className={`number flex justify-center items-center rounded-full text-white w-5 h-5 py-1 px-1 text-sm ${
            currentStep == 3 ? "bg-[#009688] " : "bg-[#00000061]"
          }`}
        >
          3
        </span>
        <span
          className={`text hidden md:block text-sm text-nowrap ${
            currentStep == 3 ? "text-black" : "text-[#00000061]"
          }`}
        >
          تغییر رمز عبور
        </span>
      </div>
    </div>
  );
}

export default memo(Steper);
