import dbConnect from "@/backend/config/dbConfig";
import { registerUser } from "@/backend/controllers/authControllers";
import { checkRoomBookingAvailability } from "@/backend/controllers/bookingControllers";

import { NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  return checkRoomBookingAvailability(request, {}); // ✅ Pass empty params
}

