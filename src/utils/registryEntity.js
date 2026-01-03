import loginFormConfig from "@/constants/auth/login";
import getOtpConfig from "@/constants/auth/forgotPassword/getOtp";
import checkOtpConfig from "@/constants/auth/forgotPassword/checkOtp";
import resetPasswordConfig from "@/constants/auth/forgotPassword/resetPassword";
import suggestConfig from "@/constants/suggests";
import inSystemMessageConfig from "@/constants/inSystemMessage";
import replayMessageConfig from "@/constants/replayMessage";

export default {
  login: loginFormConfig,
  getOtp: getOtpConfig,
  checkOtp: checkOtpConfig,
  resetPassword: resetPasswordConfig,
  suggest: suggestConfig,
  inSystemMessage: inSystemMessageConfig,
  replayMessage: replayMessageConfig,
};
