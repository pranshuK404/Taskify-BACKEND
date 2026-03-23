import { Project } from "../../models/project.model.js";
import { ApiError } from "../../utils/apiError.js";
import { generateProjectKey } from "../../utils/generateProjectKey.js";

export const createProjectService = async ({
  title,
  description,
  visibility,
  userId,
}) => {
  // Generate a unique project key and check if it already exists upto 10 times----
  let projectKey;
  let attempts = 0;
  const MAX_ATTEMPTS = 10;

  while (attempts < MAX_ATTEMPTS) {
    projectKey = generateProjectKey(title);

    const exists = await Project.exists({ projectKey });

    if (!exists) break;

    attempts++;
  }

  if (attempts === MAX_ATTEMPTS) {
    throw new ApiError(500, "Unable to generate unique project key");
  }

  ///---creating project document-----
  const createdProject = await Project.create({
    title,
    description,
    visibility,
    adminId: userId,
    createdBy: userId,
    members: [
      {
        userId: userId,
        role: "admin",
      },
    ],
    memberCount: 1,
    projectKey,
  });
  return createdProject;
};
