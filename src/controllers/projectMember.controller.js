import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

//--------IMPORTED SERVICES----------
import { getProjectMembersService } from "../services/project/getProjectMembers.service.js";
import { addMemberService } from "../services/project/addMember.service.js";
import { removeMemberService } from "../services/project/removeMember.service.js";

//----CONTROLLERS----

//---GET PROJECT MEMBERS----
const getProjectMembersController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const members = await getProjectMembersService(projectId, userId);
  return res
    .status(200)
    .json(new ApiResponse(200, members, "Members fetched successfully"));
});

//----ADD MEMBER TO PROJECT----
const addMemberController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const projectId = req.project._id;
  const projectTitle = req.project.title;

  const addedMember = await addMemberService(projectId, projectTitle, email);

  return res
    .status(200)
    .json(new ApiResponse(200, addedMember, "Member added successfully"));
});
//-----REMOVE MEMBER FROM PROJECT----

const removeMemberController = asyncHandler(async (req, res) => {
  const memberId = req.params.memberId;
  const project = req.project;

  const { removedMemberId, memberCount } = await removeMemberService(
    project,
    memberId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { removedMemberId, memberCount },
        "Member removed successfully",
      ),
    );
});

//

export const projectMemberControllers = {
  getProjectMembersController,
  addMemberController,
  removeMemberController,
};
