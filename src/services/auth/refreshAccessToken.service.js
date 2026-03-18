import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError.js";
import { User } from "../../models/user.model.js";
import { generateAccessAndRefreshTokens } from "../../utils/generateAccessRefreshTokens.js";

export const refreshAccessToken = async (clientRefreshToken) => {
  if (!clientRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  let decodedPayload;
  try {
    decodedPayload = jwt.verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "invalid or expired refresh token");
  }

  const user = await User.findById(decodedPayload._id).select("+refreshToken");

  if (!user || user.refreshToken !== clientRefreshToken) {
    throw new ApiError(401, "Refresh token is not valid");
  }
  // Generate new jwt tokens and save the new refresh token in db
  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user);

  return { accessToken, newRefreshToken };
};
