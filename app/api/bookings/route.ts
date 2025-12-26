import dbConnect from "@/backend/config/dbConfig";
import { newBooking } from "@/backend/controllers/bookingControllers";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";
import { NextRequest } from "next/server";
export async function POST(request: NextRequest) {
const authResult=await isAuthenticatedUser(request);
if(authResult) return authResult;
  return newBooking(request, {});
}

