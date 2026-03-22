import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

const router = Router();

//-----------Importing Validators----------------
import { createProjectValidationRules } from "../validators/project/createProject.validator.js";

// -----------Importing Route controllers----------------
import { projectControllers } from "../controllers/project.controller.js";

// -----------Mounting Routes----------------

router.post(
  "/",
  verifyJWT,
  createProjectValidationRules,
  validate,
  projectControllers.createProjectController,
);

export default router;
