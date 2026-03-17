import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUser } from "../services/auth/register.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

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

export const authControllers = {
  registerUserController,
};
