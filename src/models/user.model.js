import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";


const SALT_ROUNDS = 10;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 5,
      maxlength: 25,
      index: true, // for faster search
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // regex check-- for email format
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // to exclude password field when fetching user data
    },
    role: {
      type: String,
      enum: {
        values: ["user", "platform_admin"],
        message: "Invalid role",
      },
      default: "user",
    },
    avatar: {
      url: {
        type: String,
        default: "https://placehold.co/600x400",
      },
      localPath: {
        type: String,
        default: "",
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpiry: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true,
    versionKey: false
   },
);

//------- hashing password---------

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcryptjs.hash(this.password, SALT_ROUNDS);
});

//------- adding method to User prototype to check password correct

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

//------- toJSON() method , excludes sensitive fields when sending user data in response--

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

export const User = mongoose.model("User", userSchema);
