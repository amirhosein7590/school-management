export const permission = {
  owner: {
    pages: ["home", "inSystemMessage"],
  },
  manager: {
    pages: ["home", "inSystemMessage"],
  },
  teacher: {
    pages: ["home", "inSystemMessage"],
  },
};

export const canAccessPage = (page, role) => {
  if (!page || !role) return false;
  const p = permission[role];
  if (!p || !Array.isArray(p.pages)) return false;
  return p.pages.includes(page);
};
