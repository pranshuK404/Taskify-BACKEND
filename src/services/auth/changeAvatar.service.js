import { ApiError } from "../../utils/apiError.js";
import cloudinary from "../../config/cloudinary.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

const updateAvatarService = async ({ fileBuffer, user }) => {
  if (!fileBuffer) {
    throw new ApiError(400, "File buffer is required");
  }

  // ---- Delete old avatar ONLY if it's custom
  if (user.avatar?.publicId) {
    try {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    } catch (error) {
      console.error("Failed to delete old avatar:", error.message);
    }
  }

  // ------------ Upload new avatar
  const uploadResult = await uploadToCloudinary(fileBuffer, "avatars");

  // ----------- Update user
  user.avatar = {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };

  await user.save({ validateBeforeSave: false });

  return {
    avatar: user.avatar.url,
  };
};

//------------------------------delete avatar service---------------

const deleteAvatarService = async (user) => {
  // ----- If already default → do nothing

  if (!user.avatar?.publicId) {
    throw new ApiError(400, "No custom avatar to delete");
  }

  // --------- Delete from cloudinary
  try {
    await cloudinary.uploader.destroy(user.avatar.publicId);
  } catch (error) {
    throw new ApiError(500, "Failed to delete avatar");
  }

  // ------ Reset to default
  user.avatar = {
    url: "https://placehold.co/600x400",
    publicId: null,
  };

  await user.save({ validateBeforeSave: false });

  return {
    avatar: user.avatar.url,
  };
};

export const changeUserAvatar = {
  updateAvatarService,
  deleteAvatarService,
};
