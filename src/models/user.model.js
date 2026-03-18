import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
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
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      select: false,
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

  // obj.id = obj._id;  ------ learn about it later----
  // delete obj._id;
  delete obj.__v;

  // remove sensitive
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpiry;

  return obj;
};


// creating and adding refresh and access token generator method to user prototype -----

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
        _id: this._id.toString(),
      email: this.email,
      username: this.username,
      role: this.role,
      isVerified: this.isVerified,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};


export const User = mongoose.model("User", userSchema);
