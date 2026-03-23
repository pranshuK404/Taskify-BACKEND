import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.model.js";

export const verifyProjectAdmin = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const project = await Project.findOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId,
        role: "admin",
      },
    },
  });

  if (!project) {
    throw new ApiError(403, "Only project admin can perform this action");
  }

  req.project = project;

  next();
});
