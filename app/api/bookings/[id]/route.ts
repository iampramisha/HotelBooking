import { getBookingDetails } from "@/backend/controllers/bookingControllers";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await isAuthenticatedUser(request);
  if (authResult) return authResult;

  // ✅ pass params to controller
  return getBookingDetails(request, { params });
}
