import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "current password and new password are required");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from current password",
    );
  }
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  user.refreshToken = null; // log out from all devices by invalidating refresh tokens
  await user.save();

  console.log("password is changed!"); //----remove this line after testing

  return {
    message: "Password changed successfully. Please log in again.",
  };
};



export const passwordService = {
  changePassword,
};
