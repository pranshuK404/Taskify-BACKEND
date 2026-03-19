import { ApiError } from "../../utils/apiError.js";

export const updateProfile = async ({ username, fullname, user }) => {
  const trimmedUsername = username?.trim();
  const trimmedFullname = fullname?.trim();

  if (!trimmedUsername && !trimmedFullname) {
    throw new ApiError(400, "At least one field is required");
  }

  let isUpdated = false;
  //  Username update
  if (trimmedUsername && trimmedUsername.toLowerCase() !== user.username) {
    user.username = trimmedUsername.toLowerCase();
    isUpdated = true;
  }

  // Fullname update
  if (trimmedFullname && trimmedFullname !== user.fullname) {
    user.fullname = trimmedFullname;
    isUpdated = true;
  }

  if (!isUpdated) {
    throw new ApiError(400, "NO change detected!");
  }

  const updatedUser = await user.save();

  return {
    _id: updatedUser._id,
    username: updatedUser.username,
    fullname: updatedUser.fullname,
    email: updatedUser.email,
  };
};


