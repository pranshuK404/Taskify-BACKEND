import { Project } from "../../models/project.model.js";
import { generateProjectKey } from "../../utils/generateProjectKey.js";

export const createProjectService = async ({
  title,
  description,
  visibility,
  userId,
}) => {
// Generate a unique project key and check if it already exists----
  let projectKey;
  let exists = true;

  while (exists) {
    projectKey = generateProjectKey(title);

    const existing = await Project.findOne({ projectKey });
    if (!existing) exists = false;
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
