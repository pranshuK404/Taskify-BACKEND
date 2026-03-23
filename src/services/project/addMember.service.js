import { Project } from "../../models/project.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { sendMail } from "../../utils/sendMail.js";


export const addMemberService = async (projectId,projectTitle, email) => {
  const user = await User.findOne({ email }).select("_id email");

  if (!user) {
    throw new ApiError(404, "User not registered");
  }

  /* ----- Atomic member insertion */

  const updateResult = await Project.updateOne(
    {
      _id: projectId,
      "members.userId": { $ne: user._id }, // prevents duplicates
    },
    {
      $push: {
        members: {
          userId: user._id,
          role: "member",
        },
      },
      $inc: { memberCount: 1 }, // keep count accurate
    },
  );
  /* ---- Detect duplicate attempt */

  if (updateResult.modifiedCount === 0) {
    throw new ApiError(400, "User is already a member");
  }

  sendMail(user.email, `You were added to project ${projectTitle}`).catch(
    (err) => console.error("Email failed:", err),
  );

  return {
    userId: user._id,
    role: "member",
  };
};
