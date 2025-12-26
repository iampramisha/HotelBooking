
import { getBookingDetails, myBookings } from "@/backend/controllers/bookingControllers";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";
import { NextRequest } from "next/server";

// ✅ PATCH method since we are updating user password
export async function GET(request: NextRequest) {
  const authResult = await isAuthenticatedUser(request);
  if (authResult) return authResult;

  return myBookings(request, {});
}
