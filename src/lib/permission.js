export const permission = {
  owner: {
    pages: ["home", "inSystemMessage", "profile"],
  },
  manager: {
    pages: ["home", "inSystemMessage", "profile"],
  },
  teacher: {
    pages: ["home", "inSystemMessage", "profile"],
  },
};

export const canAccessPage = (page, role) => {
  if (!page || !role) return false;
  const p = permission[role];
  if (!p || !Array.isArray(p.pages)) return false;
  return p.pages.includes(page);
};
