import { body } from "express-validator";

const registerValidationRules = [

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5, max: 25 })
    .withMessage("Username must be between 5 and 25 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Fullname is required")
    .isLength({ max: 100 })
    .withMessage("Fullname cannot exceed 100 characters")

];

export { registerValidationRules };
