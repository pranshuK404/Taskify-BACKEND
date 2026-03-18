import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUser } from "../services/auth/register.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { cookieOptions } from "../constants.js";

//------   Register a new user--------
const registerUserController = asyncHandler(async (req, res) => {
  const { email, username, password, fullname } = req.body;

  const createdUser = await registerUser({
    email,
    username,
    password,
    fullname,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "Registration successful. Please check your email to verify your account.",
      ),
    );
});

//------   Verify email--------
import { verifyEmail } from "../services/auth/verifyEmail.service.js";

const emailVerificationController = asyncHandler(async (req, res) => {
  const token = req.query.token?.trim();

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }
  const verifiedUser = await verifyEmail(token);
  return res
    .status(200)
    .json(new ApiResponse(200, verifiedUser, "email verified successfully"));
});

//------   Resend verification email--------
import { resendVerificationEmail } from "../services/auth/resendEmail.service.js";

const resendVerificationEmailController = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const { message } = await resendVerificationEmail(email);

  return res.status(200).json(new ApiResponse(200, [], message));
});

//------   Login user--------
import { loginUser } from "../services/auth/login.service.js";

const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await loginUser({ email, password });

  // Set cookies and send response to client
  res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(200, {}, "User logged in successfully"));
});

//------   Logout user--------
import { userLogout } from "../services/auth/logout.service.js";
const logoutUserController = asyncHandler(async (req, res) => {
  const { message } = await userLogout(req.user);

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, message));
});

//------   Refreshing access token--------
import { refreshAccessToken } from "../services/auth/refreshAccessToken.service.js";

const refreshAcessTokenController = asyncHandler(async (req, res) => {
  const refresh_token = (
    req.cookies.refreshToken || req.body.refreshToken
  )?.trim();
  const { accessToken, newRefreshToken } =
    await refreshAccessToken(refresh_token);

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    })
    .cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(200, {}, "New tokens have been set"));
});

//------   Change password--------
import { passwordService } from "../services/auth/password.service.js"; 

const changePasswordController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  const { message } = await passwordService.changePassword({
    userId,
    currentPassword,
    newPassword,
  });

  return res.status(200).json(new ApiResponse(200, {}, message));
});

export const authControllers = {
  registerUserController,
  emailVerificationController,
  resendVerificationEmailController,
  loginUserController,
  logoutUserController,
  refreshAcessTokenController,
  changePasswordController,
};
