import { getRoomDetails, updateRoom } from "@/backend/controllers/roomControllers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // params is a Promise now
) {
  return getRoomDetails(request, context);  // pass context as is
}


