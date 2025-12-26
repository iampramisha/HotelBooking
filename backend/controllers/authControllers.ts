import { NextRequest, NextResponse } from "next/server";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import User from "../models/user";
import dbConnect from "../config/dbConfig";
import errorHandler from "../utils/errorHandler";
import { delete_file, upload_file } from "../utils/cloudinary";
import { resetPasswordHTMLTemplate } from "../utils/emailTemplates";
import sendEmail from "../utils/sendEmail";
import crypto from 'crypto'
export const registerUser=catchAsyncErrors(async(req:NextRequest)=>{
    await dbConnect(); // <== add this line

    const body=await req.json();
    const {name,email,password}=body;
const newUser = new User({ name, email, password });
await newUser.save(); // This always triggers pre("save")

    return NextResponse.json({
        success:true,
newUser


    })
});
//update user profile => /api/me/update
export const updateProfile =catchAsyncErrors(async(req:NextRequest)=>{
    await dbConnect();
    const body= await req.json();
const userData={
    name:body.name,
    email:body.email,
};
const userr=await User.findByIdAndUpdate(req?.user?._id,userData);
return NextResponse.json({
    success:true,
    userr
})
});

export const updatePassword = catchAsyncErrors(async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();
  console.log("[Server] Request body:", body); // log request body

  // Check if user is attached to request
  if (!req.user?._id) {
    console.log("[Server] User not authenticated"); // log auth failure
    throw new errorHandler("User not authenticated", 401);
  }

  const user = await User.findById(req.user._id).select("+password");

  // If user not found
  if (!user) {
    console.log("[Server] User not found with ID:", req.user._id);
    throw new errorHandler("User not found", 404);
  }

  // Compare old password
  const isMatched = await user.comparePassword(body.oldPassword);
  if (!isMatched) {
    console.log("[Server] Old password does not match for user:", user._id);
    throw new errorHandler("Old password is incorrect", 400);
  }

  // Update password and save
  user.password = body.password;
  await user.save();
  console.log("[Server] Password updated successfully for user:", user._id);

  return NextResponse.json({
    success: true,
    message: "Password updated successfully",
  });
});
export const uploadAvatar =catchAsyncErrors(async(req:NextRequest)=>{
    await dbConnect();
const body =await req.json();
const avatarResponse=await upload_file(body?.avatar,"bookit/avatars");
//remove avatar from cloudinary
if(req?.user?.avatar?.public_id){
    await delete_file(req?.user?.avatar?.public_id)
}
const user=await User.findByIdAndUpdate(req?.user?._id,{
    avatar:avatarResponse
})
return NextResponse.json({
    success: true,
    user,
})
});
//forgot password../api/password/forgot
export const forgotPassword=catchAsyncErrors(async(req:NextRequest)=>{
    await dbConnect();
    const body=await req.json();
    const user=await User.findOne({email:body.email})
    if(!user){
        throw new errorHandler('user not found with this email',404)
    }
    //get reset token
// Generate reset token
const resetToken = user.getResetPasswordToken();

// ✅ Log raw vs hashed token
console.log("Raw token (to send in email):", resetToken);
console.log("Hashed token (will be saved in DB):", user.resetPasswordToken);

// Save user with hashed token
await user.save();

    //create reset password url
const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/password/reset/${resetToken}`;

    const message=resetPasswordHTMLTemplate(user?.name,resetUrl);
    try{
await sendEmail({
    email:user.email,
    subject:'BookIt Password Recovery',
    message
})
    }catch(error:any){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save();
        throw new errorHandler(error?.message,500)
    }
    return NextResponse.json({
        success: true,
        user
    })
});
export const resetPassword = catchAsyncErrors(
  async (req: NextRequest, token: string) => {
    await dbConnect();

    const body = await req.json();

    // Hash the token from the URL
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token) // ✅ token is passed directly
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new errorHandler(
        "Password reset token is invalid or has expired",
        404
      );
    }

    if (body.password !== body.confirmPassword) {
      throw new errorHandler("Passwords do not match", 400);
    }

    user.password = body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return NextResponse.json({ success: true });
  }
);