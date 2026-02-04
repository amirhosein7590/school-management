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
import schoolSettingsConfig from "@/constants/school/schoolSettings";
import addClassConfig from "@/constants/class/addClass";
import editDeleteClassConfig from "@/constants/class/editDeleteClass";
import addTeacherConfig from "@/constants/teacher/addTeacher";
import editDeleteTeacher from "@/constants/teacher/editDeleteTeacher";
import teachersClassificationConfig from "@/constants/teacher/teachersClassification";
import addManagerConfig from "@/constants/managers/addManager";
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
import exportClassesToExcel from "@/constants/exportToExcel/classes";
import exportTeachersToExcel from "@/constants/exportToExcel/teachers";
import exportStudentsToExcel from "@/constants/exportToExcel/students";
import exportTeacherAttendancesToExcel from "@/constants/exportToExcel/teacherAttendances";
import exportStudentAttendancesToExcel from "@/constants/exportToExcel/studentsAttendances";
import importStudentsFromExcel from "@/constants/importFromExcel/students";
import importTeachersFromExcel from "@/constants/importFromExcel/teachers";
import addSchoolConfig from "@/constants/school/addSchool";
import editDeleteSchoolConfig from "@/constants/school/editDeleteSchool";
import exportSchoolsToExcel from "@/constants/exportToExcel/schools";
import editDeleteManagerConfig from "@/constants/managers/editDeleteManagers";

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
  addSchool: addSchoolConfig,
  schoolSettings: schoolSettingsConfig,
  editDeleteSchool: editDeleteSchoolConfig,
  addClass: addClassConfig,
  editDeleteClass: editDeleteClassConfig,
  addTeacher: addTeacherConfig,
  editDeleteTeacher: editDeleteTeacher,
  teachersClassification: teachersClassificationConfig,
  addManager: addManagerConfig,
  editDeleteManager: editDeleteManagerConfig,
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
  showStudentReport: showStudentReportConfig,
  classesToExcel: exportClassesToExcel,
  teachersToExcel: exportTeachersToExcel,
  studentsToExcel: exportStudentsToExcel,
  "teachersAttendances/reportToExcel": exportTeacherAttendancesToExcel,
  "studentsAttendances/reportToExcel": exportStudentAttendancesToExcel,
  studentsFromExcel: importStudentsFromExcel,
  teachersFromExcel: importTeachersFromExcel,
  schoolsToExcel: exportSchoolsToExcel,
};
