export const permission = {
  owner: {
    pages: ["home", "inSystemMessage", "profile", "changePassword"],
  },
  manager: {
    pages: ["home", "inSystemMessage", "profile", "changePassword"],
  },
  teacher: {
    pages: ["home", "inSystemMessage", "profile", "changePassword"],
  },
};

export const canAccessPage = (page, role) => {
  if (!page || !role) return false;
  const p = permission[role];
  if (!p || !Array.isArray(p.pages)) return false;
  return p.pages.includes(page);
};
