import { body } from "express-validator";

const createProjectValidationRules= [
  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 5, max: 50 })
    .withMessage("Project name must be between 5 and 50 characters"),
  body("description")
    .trim()
    .optional()
    .isLength({ min: 15, max: 250 })
    .withMessage("Project description must be between 15 and 250 characters"),
  body("visibility")
  .optional()
    .trim()
    .isIn(["public", "private"])
    .withMessage("Visibility must be either public or private"),
];

export { createProjectValidationRules };
