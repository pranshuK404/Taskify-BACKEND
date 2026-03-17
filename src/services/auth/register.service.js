import {User} from "../../models/user.model.js"
import { ApiError } from "../../utils/apiError.js";
import { cryptoTokenUtils } from "../../utils/cryptoToken.js";
import { sendMail } from "../../utils/sendMail.js";

export const registerUser=async(userData)=>{

   const { email, username, password, fullname } = userData;

 //checking if user exists
  const existedUser = await User.findOne({email})

  if (existedUser) {
  throw new ApiError(409, "User with this email already exists");
  }
 
  const { rawToken, hashedToken, tokenExpiry } = cryptoTokenUtils.generateToken(20);

  // create a new user and save it in db
  
  const user = await User.create({
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    password,
    fullname,
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: tokenExpiry,
  });

  const createdUser = user.toJSON();
  
   console.log(`User registered: ${createdUser.email}`); //-- log the registered user's email for debugging purposes


  //---creating and sending verification email to client---
const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

  try {
    await sendMail(createdUser.email, verificationLink);
  } catch (error) {
    console.error("Email sending failed:", error);
  }

return createdUser;

}