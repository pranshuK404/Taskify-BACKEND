export const UserRolesEnum={
  ADMIN:"admin",
  PROJECT_ADMIN:"project_admin",
  MEMBER:"member"

}

export const AvailableUserRoles=Object.values(UserRolesEnum)

 export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "Lax", // Adjust as needed (e.g., "Strict" or "None")
  };

