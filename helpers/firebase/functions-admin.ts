export const rolesEnum = {
  user: {
    id: "user",
    tier: 0,
    title: "User",
  },
  moderator: {
    id: "moderator",
    tier: 1,
    title: "Moderator",
  },
  admin: {
    id: "admin",
    tier: 2,
    title: "Admin",
  },
  superadmin: {
    id: "superadmin",
    tier: 3,
    title: "Superadmin",
  },
};

/** Auth User **/
/***************/

export const checkIfUserHasMinimumRole = (context, minimumRole) => {
  const role = context.auth.token.role;

  if (rolesEnum[minimumRole].tier <= rolesEnum[role].tier) {
    return true;
  }

  return Promise.reject(
    new Error("Request not authorized. User must be an admin.")
  );
};
