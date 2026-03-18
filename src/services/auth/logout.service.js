import { User } from "../../models/user.model.js";

export const userLogout = async (user) => {
  if (!user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  // remove refresh token from database
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { refreshToken: null },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return { message: "User logged out successfully" };
};
