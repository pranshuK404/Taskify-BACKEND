import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { sendMail } from "../../utils/sendMail.js";
import { cryptoTokenUtils } from "../../utils/cryptoToken.js";

//------------------Service function for changing password----------------
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

//-----------------forgot password service function----------------

const forgotPassword = async (email) => {
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "If this email exists, a reset link has been sent");
  }
  const { rawToken, hashedToken, tokenExpiry } =
    cryptoTokenUtils.generateToken(10);

  user.passwordResetToken = hashedToken;
  user.passwordResetExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/auth/reset-password?token=${rawToken}`;
  try {
    await sendMail(user.email, resetURL);
  } catch (error) {
    // If email sending fails, clear the reset token and expiry from the user document
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email could not be sent");
  }

  return {
    message: "Password reset email sent successfully",
  };
};

//

const resetPassword = async ({ resetToken, newPassword }) => {
  if (!newPassword || !resetToken) {
    throw new ApiError(
      401,
      "either reset token or new password have been not sent",
    );
  }

  const hashedResetToken = cryptoTokenUtils.hashToken(resetToken);

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }
  user.password = newPassword;

  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;

  user.refreshToken = null;
  await user.save();
  return {
    message: "Password reset successful. Please log in with your new password.",
  };
};

export const passwordService = {
  changePassword,
  forgotPassword,
  resetPassword,
};
