import { deleteRoom, getRoomDetails, updateRoom } from "@/backend/controllers/roomControllers";
import { NextRequest } from "next/server";



export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return updateRoom(request, context);
}
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return deleteRoom(request, context);
}