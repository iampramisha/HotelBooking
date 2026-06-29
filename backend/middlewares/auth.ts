import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { IUser } from "../models/user";

// getToken({ req }) → pulls the user info (from JWT) if the request is authenticated.

// If no token → reject with 401 Unauthorized.

// If token exists → attach the user info to the request as req.user.

// Why? So downstream controllers (like updateProfile) can simply read req.user._id without decoding the token again.

// 👉 req.user is just a convenience property we inject, so controllers always know who is making the request.





export const isAuthenticatedUser=async(req:NextRequest)=>{
  const session=await getToken({req}) 
  if(!session){
    return NextResponse.json({
        "message":"login first to access this route "
    },{
        status:401
    })
  } 
  req.user=session.user as IUser;

}

export const authorizeRoles=async(req:NextRequest,...roles:string[])=>{
  const authResult=await isAuthenticatedUser(req)
  if(authResult) return authResult

  if(!roles.includes(req.user!.role)){
    return NextResponse.json({
      message:`Role (${req.user!.role}) is not allowed to access this resource`
    },{
      status:403
    })
  }
}