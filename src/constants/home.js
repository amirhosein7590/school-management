const homeConfig = {
  buttons: {
    manager: [
      {
        id: "dashboard",
        text: "داشبورد",
        href: "/school/dashboard/manager",
        icon: "LayoutDashboard",
      },
      {
        id: "classes",
        text: "مدیریت کلاس ها",
        href: "/school/classesManagement",
        icon: "Backpack",
      },
      {
        id: "teachers",
        text: "مدیریت معلمان",
        href: "/school/teachersManagement",
        icon: "GraduationCap",
      },
      {
        id: "teachers-classification",
        text: "کلاس بندی معلمان",
        href: "/school/teachersClassification",
        icon: "School",
      },
      {
        id: "techers-attendances",
        text: "حضور و غیاب معلمان",
        href: "/school/teachersAttendances",
        icon: "UserCheck",
      },
      {
        id: "teachers-report",
        text: "گزارش گیری معلمان",
        href: "/school/teachersReport",
        icon: "Notebook",
      },
      {
        id: "students",
        text: "مدیریت دانش آموزان",
        href: "/school/studentsManagement",
        icon: "Users",
      },
      {
        id: "students-classification",
        text: "کلاس بندی دانش آموزان",
        href: "/school/studentsClassification",
        icon: "UserRoundPen",
      },
      {
        id: "students-report",
        text: "گزارش گیری دانش آموزان",
        href: "/school/studentsReport",
        icon: "Notebook",
      },
      {
        id: "school-settings",
        text: "تنظیمات مدرسه",
        href: "/school/schoolSettings",
        icon: "Settings",
      },
    ],
    owner: [
      // {
      //   id: "dashboard",
      //   text: "داشبورد",
      //   href: "/school/dashboard/owner",
      //   icon: "LayoutDashboard",
      // },
      {
        id: "schools",
        text: "مدیریت مدارس",
        href: "/school/schoolsManagement",
        icon: "School",
      },
      {
        id: "managers",
        text: "مدیریت مدیران",
        href: "/school/managersManagement",
        icon: "Users",
      },
      {
        id: "setSchool",
        text: "مدرسه بندی مدیران",
        href: "/school/setSchool",
        icon: "School2Icon"
      }
    ],
    teacher: [
      {
        id: "dashboard",
        text: "داشبورد",
        href: "/school/dashboard/teacher",
        icon: "LayoutDashboard",
      },
      {
        id: "students-attendances",
        text: "حضور و غیاب دانش آموزان",
        href: "/school/studentsAttendances",
        icon: "UserCheck",
      },
      {
        id: "students-report",
        text: "گزارش گیری دانش آموزان",
        href: "/school/studentsReport",
        icon: "Notebook",
      },
    ],
  },
};

export default homeConfig;
