import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { cryptoTokenUtils } from "../../utils/cryptoToken.js";
import { sendMail } from "../../utils/sendMail.js";



export const resendVerificationEmail=async(email)=>{
   const user = await User.findOne({email});
  if (!user) {
    throw new ApiError(404, "User not registered");
  }
  if (user.isVerified) {
    throw new ApiError(400, "Email already verified");
  }
  const {rawToken,hashedToken,tokenExpiry}=cryptoTokenUtils.generateToken(15)
    user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({validateBeforeSave: false});
  //----Send verification email with the raw token----

  const verificationLink = `${process.env.CLIENT_URL}/auth/verify-email?token=${rawToken}`;

 try {
  await sendMail(user.email, verificationLink);
} catch (error) {
  console.error("Email sending failed:", error);
}

  return { message: "Verification email resent successfully. Please check your inbox." };

}