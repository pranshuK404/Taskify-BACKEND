import { body } from "express-validator";

export const addMemberValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("New email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
];
