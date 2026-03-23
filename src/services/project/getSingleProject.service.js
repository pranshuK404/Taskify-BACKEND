import { Project } from "../../models/project.model.js";
import { ApiError } from "../../utils/apiError.js";
import { Task } from "../../models/task.model.js";

export const getSingleProjectService = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    "members.userId": userId,
  })
    .select("-members -__v -adminId -archivedAt")
    .lean();

  if (!project) {
    throw new ApiError(404, "Project not found or access denied");
  }
  const taskCount = await Task.countDocuments({ projectId });
  return {
    ...project,
    taskCount,
  };
};
