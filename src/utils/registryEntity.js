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
import teachersClassificationConfig from "@/constants/teacher/teachersClassification";
import addStudentsConfig from "@/constants/student/addStudent";
import editDeleteStudentConfig from "@/constants/student/editDeleteStudent";
import studentsClassificationConfig from "@/constants/student/studentsClassification";
import addTeacherAttendanceConfig from "@/constants/teacherAttendances/addTeacherAttendance";
import editDeleteTeacherAttendancesConfig from "@/constants/teacherAttendances/editDeleteTeacherAttendances";
import searchTeacherReportConfig from "@/constants/teacherAttendances/report/search";
import showTeacherReportConfig from "@/constants/teacherAttendances/report/showReport";
import addStudentAttendanceConfig from "@/constants/studentAttendances/addStudentAttendance";
import editDeleteStudentAttendancesConfig from "@/constants/studentAttendances/editDeleteStudentAttendances";
import searchStudentReportConfig from "@/constants/studentAttendances/report/search";
import showStudentReportConfig from "@/constants/studentAttendances/report/showReport";

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
  teachersClassification: teachersClassificationConfig,
  addStudent: addStudentsConfig,
  editDeleteStudent: editDeleteStudentConfig,
  studentsClassification: studentsClassificationConfig,
  addTeacherAttendance: addTeacherAttendanceConfig,
  editDeleteTeacherAttendances: editDeleteTeacherAttendancesConfig,
  searchTeacherReport: searchTeacherReportConfig,
  showTeacherReport: showTeacherReportConfig,
  addStudentAttendance: addStudentAttendanceConfig,
  editDeleteStudentAttendances: editDeleteStudentAttendancesConfig,
  searchStudentReport: searchStudentReportConfig,
  showStudentReport : showStudentReportConfig
};
