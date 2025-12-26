import dbConnect from "@/backend/config/dbConfig";
import { allRooms, newRoom } from "@/backend/controllers/roomControllers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return allRooms(request);
}
