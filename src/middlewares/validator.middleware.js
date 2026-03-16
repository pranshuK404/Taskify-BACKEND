import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  console.log(req.body); //---for debugging purposes, can be removed later

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};

export { validate };
