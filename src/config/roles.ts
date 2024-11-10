export const roles = {
  ICT_TECHNICIAN: "ICT_Technician",
  HEAD_OF_DEPARTMENT: "Head_Of_Department",
  SECRETARY: "Secretary",
  DEVELOPER: "Developer",
};

export const rolePermissions = {
  [roles.ICT_TECHNICIAN]: ["view_jobs", "update_jobs"],
  [roles.HEAD_OF_DEPARTMENT]: ["view_jobs", "update_jobs", "delete_jobs"],
  [roles.SECRETARY]: ["view_jobs"],
  [roles.DEVELOPER]: ["view_jobs", "update_jobs", "create_jobs"],
};
