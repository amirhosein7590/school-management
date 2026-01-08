import loginFormConfig from "@/constants/auth/login";
import getOtpConfig from "@/constants/auth/forgotPassword/getOtp";
import checkOtpConfig from "@/constants/auth/forgotPassword/checkOtp";
import resetPasswordConfig from "@/constants/auth/forgotPassword/resetPassword";
import suggestConfig from "@/constants/suggests";
import inSystemMessageConfig from "@/constants/inSystemMessage";
import replayMessageConfig from "@/constants/replayMessage";
import pageGuideConfig from "@/constants/pageGuide";
import profileConfig from "@/constants/profile";
import changePasswordConfig from "@/constants/changePassword";
import editSchoolConfig from "@/constants/school/editSchool";
import addClassConfig from "@/constants/class/addClass";
import editDeleteClassConfig from "@/constants/class/editDeleteClass";
import addTeacherConfig from "@/constants/teacher/addTeacher";
import editDeleteTeacher from "@/constants/teacher/editDeleteTeacher";

export default {
  login: loginFormConfig,
  getOtp: getOtpConfig,
  checkOtp: checkOtpConfig,
  resetPassword: resetPasswordConfig,
  suggest: suggestConfig,
  inSystemMessage: inSystemMessageConfig,
  replayMessage: replayMessageConfig,
  pageGuide: pageGuideConfig,
  profile: profileConfig,
  changePassword: changePasswordConfig,
  editSchool: editSchoolConfig,
  addClass: addClassConfig,
  editDeleteClass: editDeleteClassConfig,
  addTeacher: addTeacherConfig,
  editDeleteTeacher: editDeleteTeacher,
};
