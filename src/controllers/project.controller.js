import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

//---------IMPORTED SERVICES----------
import { createProjectService } from "../services/project/createProject.service.js";
import { getProjectService } from "../services/project/getProject.service.js";
import { getSingleProjectService } from "../services/project/getSingleProject.service.js";

//---------CREATE PROJECT--------
const createProjectController = asyncHandler(async (req, res) => {
  const { title, description, visibility } = req.body;
  const userId = req.user._id;

  const createdProject = await createProjectService({
    title,
    description,
    visibility,
    userId,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, createdProject, "Project created successfully"));
});

//----- GET PROJECTs-------
const getProjectController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const projects = await getProjectService(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: projects.length, projects },
        "Projects fetched successfully",
      ),
    );
});

//----- GET SINGLE PROJECT-------
const getSingleProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { _id: userId } = req.user;
  const project = await getSingleProjectService(projectId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

export const projectControllers = {
  createProjectController,
  getProjectController,
  getSingleProjectController,
};
