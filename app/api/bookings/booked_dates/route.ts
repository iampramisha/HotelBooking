import dbConnect from "@/backend/config/dbConfig";
import { registerUser } from "@/backend/controllers/authControllers";
import { getBookDates } from "@/backend/controllers/bookingControllers";

import { NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  return getBookDates(request, {}); // ✅ Pass empty params
}

