export const permission = {
  owner: {
    pages: ["home"],
  },
  manager: {
    pages: ["home"],
  },
  teacher: {
    pages: ["home"],
  },
};

export const canAccessPage = (page, role) => {
  if (!page || !role) return false;
  const p = permission[role];
  return p.pages.includes(page);
};

