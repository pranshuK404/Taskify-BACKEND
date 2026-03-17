import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { cryptoTokenUtils } from "../../utils/cryptoToken.js";

export const verifyEmail = async (token) => {
  const clientHashedToken = cryptoTokenUtils.hashToken(token);
  const user = await User.findOne({
    emailVerificationToken: clientHashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token ");
  }
  
  if (user.isVerified) {
    throw new ApiError(400, "Email already verified");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  const verifiedUser = user.toJSON();

  return verifiedUser;
};
