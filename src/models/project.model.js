import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      toLowerCase: true,
      index: true,
    },
    description: {
      type: String,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
          index: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
    memberCount: {
      type: Number,
    },
    projectKey: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    archivedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
