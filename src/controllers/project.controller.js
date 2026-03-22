import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

//---------IMPORTED SERVICES----------
import { createProjectService } from "../services/project/createProject.service.js";


//---------CREATE PROJECT--------
const createProjectController = asyncHandler(async (req, res) => {
  const { title, description, visibility } = req.body;
  const userId = req.user._id;

  const createdProject = await createProjectService({title,description,visibility,userId,});
  return res
    .status(201)
    .json(new ApiResponse(201, createdProject, "Project created successfully"));
});

export const projectControllers = {
  createProjectController,
};
