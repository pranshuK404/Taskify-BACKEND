import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { registerValidationRules } from "../validators/userRegister.validator.js";


const router = Router()

// -----------Importing Route controllers----------------
import { authControllers } from "../controllers/auth.controller.js";

// -----------Mounting Routes----------------

router.post(
  "/register",
  registerValidationRules,
  validate,
  authControllers.registerUserController
); //--register route

export default router

