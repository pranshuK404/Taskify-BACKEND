import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";
import { verifyProjectAdmin } from "../middlewares/verifyProjectAdmin.middleware.js";

const router = Router();

//-----------Importing Validators----------------
import { addMemberValidationRules } from "../validators/project/addMember.validator.js";

//-----------Importing Route controllers----------------
import { projectMemberControllers } from "../controllers/projectMember.controller.js";

//-----------Mounting Routes----------------

//----get project members route
router.get(
  "/:projectId/members",
  verifyJWT,
  projectMemberControllers.getProjectMembersController,
);

//----add member to project route
router.post(
  "/:projectId/members",
  verifyJWT,
  verifyProjectAdmin,
  addMemberValidationRules,
  validate,
  projectMemberControllers.addMemberController,
);

//----remove member from project route
router.delete(
  "/:projectId/members/:memberId",
  verifyJWT,
  verifyProjectAdmin,
  projectMemberControllers.removeMemberController,
);

export default router;
