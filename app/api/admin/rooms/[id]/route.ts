import { deleteRoom, updateRoom } from "@/backend/controllers/roomControllers";
import { authorizeRoles } from "@/backend/middlewares/auth";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const authResult = await authorizeRoles(request, "admin");
  if (authResult) return authResult;
  return updateRoom(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const authResult = await authorizeRoles(request, "admin");
  if (authResult) return authResult;
  return deleteRoom(request, context);
}