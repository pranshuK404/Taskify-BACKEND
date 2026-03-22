import { Project } from "../../models/project.model.js";

// Project.find() never returns null or undefined.It always returns an array.
export const getProjectService = async (userId) => {
  const projects = await Project.find({ "members.userId": userId })
    .select("title visibility status memberCount projectKey createdAt")
    .sort({ createdAt: -1 }) // to sort the projects by createdAt in descending order
    .lean();

  //--Usually APIs should not throw error for empty lists.
  //--.lean(), tells Mongoose:Return plain JavaScript objects instead of full Mongoose documents.

  return projects;
};
