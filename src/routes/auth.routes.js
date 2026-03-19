import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//------ Importing Validation rules----------------
import { registerValidationRules } from "../validators/userRegister.validator.js";
import { loginValidationRules } from "../validators/userLogin.validator.js";
import { changePasswordValidationRules } from "../validators/changePassword.validator.js";
import { resetPasswordValidationRules } from "../validators/resetPassword.validator.js";
import { updateProfileValidationRules } from "../validators/updateUserprofile.validator.js";
import { changeEmailValidationRules } from "../validators/updateUserprofile.validator.js";


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

//--refresh access token route--
router.post("/refresh-tokens", authControllers.refreshAcessTokenController);

//-----------protected routes for authentication-------------

//--logout route--
router.post("/logout", verifyJWT, authControllers.logoutUserController);

//--change password route--
router.post("/change-password", verifyJWT, changePasswordValidationRules, validate, authControllers.changePasswordController);

//--forgot password route--
router.post("/forgot-password", authControllers.forgotPasswordController);

//--reset password route--
router.post("/reset-password",resetPasswordValidationRules,validate ,authControllers.resetPasswordController);

//--get my profile route--
router.get("/me", verifyJWT, authControllers.getMyProfileController);

//--update basic profile----

router.patch("/update-profile",verifyJWT,updateProfileValidationRules,validate
  ,authControllers.updateUserProfileController
)

//---request email change--------

router.post("/change-email",verifyJWT,changeEmailValidationRules,validate,authControllers.requestEmailChangeController)

//------verify email change--------

router.post("/verify-email-change",authControllers.verifyEmailChangeController)


export default router;
