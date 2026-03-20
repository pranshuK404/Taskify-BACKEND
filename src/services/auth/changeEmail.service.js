import { ApiError } from "../../utils/apiError.js";
import { User } from "../../models/user.model.js";
import { cryptoTokenUtils } from "../../utils/cryptoToken.js";
import { sendMail } from "../../utils/sendMail.js";
const requestEmailChange = async ({ newEmail, password, userId }) => {
  if (!newEmail || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const normalizedEmail = newEmail.toLowerCase();

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // -------- Verify password-----
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // ------Same email check----
  if (normalizedEmail === user.email) {
    throw new ApiError(400, "New email cannot be same as current email");
  }

  // -------Check uniqueness
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const { rawToken, hashedToken, tokenExpiry } =
    cryptoTokenUtils.generateToken(20);

  user.newEmail = normalizedEmail
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  const verificationURL = `${process.env.CLIENT_URL}/auth/verify-email-change?token=${rawToken}`;

  try {
    await sendMail(normalizedEmail, verificationURL);
  } catch (error) {
    user.newEmail = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    throw new ApiError(500, "Email could not be sent");
  }

  return {
    message: "Email change request sent successfully. Please check your inbox.",
  };
};

//---------Verify email change service--------------------------

const verifyEmailChange = async (token) => {
  if (!token) {
    throw new ApiError(400, "Token is required");
  }
  const hashedToken = cryptoTokenUtils.hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }
  if (!user.newEmail) {
    throw new ApiError(400, "No email change request found");
  }
  const existingUser = await User.findOne({ email: user.newEmail });

  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }
  user.email = user.newEmail;
  user.isVerified = true
  user.newEmail = undefined;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  try {
    await sendMail(user.email, "Email changed successfully");
  } catch (error) {
    throw new ApiError(500, "Email could not be sent");
  }

  return {
    message: "Email updated successfully",
  };
};

export const changeEmailService = {
  requestEmailChange,
  verifyEmailChange,
};
