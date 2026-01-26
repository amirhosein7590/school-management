export const permission = {
  owner: {
    pages: ["home", "inSystemMessage", "profile", "changePassword", "test"],
  },
  manager: {
    pages: [
      "home",
      "inSystemMessage",
      "profile",
      "changePassword",
      "schoolSettings",
      "classesManagement",
      "teachersManagement",
      "teachersClassification",
      "studentsManagement",
      "studentsClassification",
      "teachersAttendances",
      "teachersReport",
      "studentsReport",
      "ManagerDashboard",
    ],
  },
  teacher: {
    pages: [
      "home",
      "inSystemMessage",
      "profile",
      "changePassword",
      "studentsAttendances",
      "studentsReport",
      "TeacherDashboard",
    ],
  },
};

export const canAccessPage = (page, role) => {
  if (!page || !role) return false;
  const p = permission[role];
  if (!p || !Array.isArray(p.pages)) return false;
  return p.pages.includes(page);
};
