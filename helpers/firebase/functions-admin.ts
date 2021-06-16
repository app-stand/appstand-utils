// @ts-nocheck
type RoleEnums = "user" | "moderator" | "admin" | "superadmin";
interface Role {
  id: RoleEnums;
  tier: number;
  title: string;
}

const rolesEnum = {
  user: {
    id: "user",
    tier: 0,
    title: "User",
  } as Role,
  moderator: {
    id: "moderator",
    tier: 1,
    title: "Moderator",
  } as Role,
  admin: {
    id: "admin",
    tier: 2,
    title: "Admin",
  } as Role,
  superadmin: {
    id: "superadmin",
    tier: 3,
    title: "Superadmin",
  } as Role,
};

/** Auth User **/
/***************/

export const checkIfUserHasMinimumRole = (
  context: any,
  minimumRole: RoleEnums
) => {
  const role = context.auth.token.role;

  if (rolesEnum[minimumRole].tier <= rolesEnum[role].tier) {
    return true;
  }

  return Promise.reject(
    new Error("Request not authorized. User must be an admin.")
  );
};
