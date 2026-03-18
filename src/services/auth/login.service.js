import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { generateAccessAndRefreshTokens } from "../../utils/generateAccessRefreshTokens.js";

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password +refreshToken",
  );
  if (!user) {
    throw new ApiError(404, "Invalid email or password");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }
  //-- Check if the password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  console.log(
    `login access token is : ${accessToken} || and refresh token :  ${refreshToken}`,
  );

  return { accessToken, refreshToken };
};
