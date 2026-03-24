import { Project } from "../../models/project.model.js";
import { ApiError } from "../../utils/apiError.js";

export const removeMemberService = async (project, memberId) => {
  if (!memberId) {
    throw new ApiError(400, "Member id is required");
  }
  //---find the target member
  const targetMember = project.members.find((member) =>
    member.userId.equals(memberId),
  );

  if (!targetMember) {
    throw new ApiError(404, "Member not found or access denied");
  }
  //------check if the target member is an admin
  if (targetMember.role === "admin") {
    throw new ApiError(403, "Admins cannot be removed using this endpoint");
  }
  //-----remove the member by atomic update
  const result = await Project.updateOne(
    { _id: project._id, "members.userId": memberId },
    {
      $pull: { members: { userId: memberId } },
      $inc: { memberCount: -1 },
    },
  );

  if (result.modifiedCount === 0) {
    throw new ApiError(404, "Member not found or access denied");
  }

  return {
    removedMemberId: memberId,
    memberCount: project.memberCount - 1,
  };
};
