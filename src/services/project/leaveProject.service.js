import { Project } from "../../models/project.model.js";
import { ApiError } from "../../utils/apiError.js";

export const leaveProjectService = async (projectId, userId) => {
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId).select("members");
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = project.members.find((member) => member.userId.equals(userId));

  if (!member) {
    throw new ApiError(403, "You are not a member of this project");
  }

  //----check for admin
  if (member.role === "admin") {
    const adminCount = project.members.filter(
      (member) => member.role === "admin",
    ).length;

    if (adminCount <= 1) {
      throw new ApiError(400, "Project must have at least one admin");
    }
  }
  const result = await Project.updateOne(
    {
      _id: projectId,
      "members.userId": userId,
    },
    {
      $pull: { members: { userId: userId } },
      $inc: { memberCount: -1 },
    },
  );

  if (result.modifiedCount === 0) {
    throw new ApiError(400, "Unable to leave project");
  }
  return {
    leftProject: true,
    removedMemberId: userId,
  };
};
