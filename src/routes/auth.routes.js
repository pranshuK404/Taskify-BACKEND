import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";

//------ Importing Validation rules----------------
import { registerValidationRules } from "../validators/userRegister.validator.js";
import { loginValidationRules } from "../validators/userLogin.validator.js";

const router = Router();

// -----------Importing Route controllers----------------
import { authControllers } from "../controllers/auth.controller.js";

// -----------Mounting Routes----------------

//--register route
router.post(
  "/register",
  registerValidationRules,
  validate,
  authControllers.registerUserController,
);

//--email verification route
router.get("/verify-email", authControllers.emailVerificationController);

//--resend verification email route
router.post("/resend-email", authControllers.resendVerificationEmailController);

//--login route
router.post(
  "/login",
  loginValidationRules,
  validate,
  authControllers.loginUserController,
);

export default router;
