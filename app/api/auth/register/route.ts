import dbConnect from "@/backend/config/dbConfig";
import { registerUser } from "@/backend/controllers/authControllers";

import { NextRequest } from "next/server";
export async function POST(request: NextRequest) {
  return registerUser(request, {}); // ✅ Pass empty params
}

