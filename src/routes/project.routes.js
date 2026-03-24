import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";
import {verifyProjectAdmin} from "../middlewares/verifyProjectAdmin.middleware.js"

const router = Router();

//-----------Importing Validators----------------
import { createProjectValidationRules } from "../validators/project/createProject.validator.js";
import { addMemberValidationRules } from "../validators/project/addMember.validator.js";

// -----------Importing Route controllers----------------
import { projectControllers } from "../controllers/project.controller.js";

// -----------Mounting Routes----------------

//----create project route
router.post(
  "/",
  verifyJWT,
  createProjectValidationRules,
  validate,
  projectControllers.createProjectController,
);

//----get projects route
router.get("/", verifyJWT, projectControllers.getProjectController);

//----get single project route
router.get(
  "/:projectId",
  verifyJWT,
  projectControllers.getSingleProjectController,
);

//----get project members route
router.get(
  "/:projectId/members",
  verifyJWT,
  projectControllers.getProjectMembersController,
);

//----add member to project route
router.post(
  "/:projectId/members",
  verifyJWT,
  verifyProjectAdmin,
  addMemberValidationRules,
  validate,
  projectControllers.addMemberController,
);
 
//----remove member from project route
router.delete(
  "/:projectId/members/:memberId",
  verifyJWT,
  verifyProjectAdmin,
  projectControllers.removeMemberController,
);


export default router;
