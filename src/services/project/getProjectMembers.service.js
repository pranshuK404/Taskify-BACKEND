import { Project } from "../../models/project.model.js";
import { ApiError } from "../../utils/apiError.js";

export const getProjectMembersService = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    "members.userId": userId,
  })
    .select("members")
    .populate("members.userId", "_id username email")
    .lean();

  if (!project) {
    throw new ApiError(404, "Project not found or access denied");
  }

  const members = project.members.map((member) => ({
    memberId: member.userId._id,
    username: member.userId.username,
    email: member.userId.email,
    role: member.role,
  }));

  return members;
};
