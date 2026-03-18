import { ApiError } from "../utils/apiError.js";

const generateAccessAndRefreshTokens = async function (user) {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError(500, error.message);
  }
};

export { generateAccessAndRefreshTokens };
