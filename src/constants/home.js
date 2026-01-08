const homeConfig = {
  buttons: {
    manager: [
      {
        id: "daily-report",
        text: "گزارش روزانه",
        href: "/school/dashboard",
        icon: "LayoutDashboard",
      },
      {
        id: "techers-attendances",
        text: "حضور و غیاب معلمان",
        href: "/school/teachersAttendances",
        icon: "UserCheck",
      },
      {
        id: "school-settings",
        text: "تنظیمات مدرسه",
        href: "/school/schoolSettings",
        icon: "Settings",
      },
      {
        id: "teachers",
        text: "مدیریت معلمان",
        href: "/school/teachersManagement",
        icon: "GraduationCap",
      },
      {
        id: "students",
        text: "مدیریت دانش آموزان",
        href: "/school/students",
        icon: "Users",
      },
      {
        id: "teachers-classification",
        text: "کلاس بندی معلمان",
        href: "/school/teachersClassification",
        icon: "School",
      },
      {
        id: "students-classification",
        text: "کلاس بندی دانش آموزان",
        href: "/school/studentsClassification",
        icon: "UserRoundPen",
      },
      {
        id: "classes",
        text: "مدیریت کلاس ها",
        href: "/school/classesManagement",
        icon: "Backpack",
      },
    ],
    owner: [
      {
        id: "daily-report",
        text: "گزارش روزانه",
        href: "/school/dashboard",
        icon: "LayoutDashboard",
      },
      {
        id: "schools",
        text: "مدرسه ها",
        href: "/school/schools",
        icon: "School",
      },
      {
        id: "managers",
        text: "مدیران",
        href: "/school/managers",
        icon: "Users",
      },
      {
        id: "teachers",
        text: "معلمان",
        href: "/school/teachers",
        icon: "GraduationCap",
      },
    ],
    teacher: [
      {
        id: "daily-report",
        text: "گزارش روزانه",
        href: "/school/dashboard",
        icon: "LayoutDashboard",
      },
      {
        id: "students-attendances",
        text: "حضور و غیاب دانش آموزان",
        href: "/school/studentsAttendances",
        icon: "UserCheck",
      },
    ],
  },
};

export default homeConfig;
