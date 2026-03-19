import { body } from "express-validator";



// Username
export const usernameRule = body("username")
  .optional()
  .trim()
  .isLength({ min: 3, max: 30 })
  .withMessage("Username must be 3-30 characters long")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("Username can only contain letters, numbers, and underscores");

// Fullname
export const fullnameRule = body("fullname")
  .optional()
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage("Full name must be 2-50 characters long")
  .not()
  .matches(/<[^>]*>?/)
  .withMessage("Invalid characters in full name");

// Email (optional)
export const emailRule = body("email")
  .optional()
  .trim()
  .isEmail()
  .withMessage("Invalid email format")
  .normalizeEmail();

// Email (required - for change email flow)
export const requiredEmailRule = body("newEmail")
  .notEmpty()
  .withMessage("New email is required")
  .isEmail()
  .withMessage("Invalid email format")
  .normalizeEmail();

// Avatar (URL-based for now)
export const avatarRule = body("avatar")
  .optional()
  .isURL()
  .withMessage("Avatar must be a valid URL");


// --------- Combined Validators (per feature)---------------------

// Update username + fullname
export const updateBasicProfileValidation = [
  usernameRule,
  fullnameRule,
];

// Update avatar
export const updateAvatarValidation = [
  avatarRule,
];

// Request email change
export const changeEmailValidation = [
  requiredEmailRule,
];
