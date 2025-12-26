
import { updateProfile } from "@/backend/controllers/authControllers";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";
import { NextRequest } from "next/server";

// ✅ PATCH method since we are updating user profile
export async function PATCH(request: NextRequest) {
const authResult=await isAuthenticatedUser(request);
if(authResult) return authResult;
  return updateProfile(request, {});
}
