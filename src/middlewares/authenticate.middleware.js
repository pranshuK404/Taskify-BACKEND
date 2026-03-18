import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new ApiError(401, "Missing access token"); //**
  }
  // Here you would typically verify the JWT token and extract user information

  let decodedToken;
  try {
    decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
  // Find user from decoded token
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  if (!user.isVerified) {
    throw new ApiError(403, "User email not verified");
  }

  // attach user info to request object for use in next middlewares or controllers

  req.user = user;
  next();
});
