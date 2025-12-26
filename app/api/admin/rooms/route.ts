import dbConnect from "@/backend/config/dbConfig";
import { allRooms, newRoom } from "@/backend/controllers/roomControllers";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  return newRoom(request);
}