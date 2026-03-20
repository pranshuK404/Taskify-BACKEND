import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { ApiError } from "./apiError.js";

export const uploadToCloudinary = (fileBuffer, folder = "avatar") => {
  return new Promise((resolve, reject) => {
  
    if (!fileBuffer) {
      return reject(new ApiError(400, "File buffer is required"));
    }

    // ----- Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        transformation: [
          { width: 300, height: 300, crop: "fill" }, // avatar optimization
        ],
      },
      (error, result) => {
        if (error) {
          return reject(
            new ApiError(500, "Failed to upload file to Cloudinary")
          );
        }

        resolve(result);
      }
    );

    // ----------Convert buffer → stream → send to cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
