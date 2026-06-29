import { allRooms, newRoom } from "@/backend/controllers/roomControllers";
import { authorizeRoles } from "@/backend/middlewares/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authResult = await authorizeRoles(request, "admin");
  if (authResult) return authResult;
  return allRooms(request);
}

export async function POST(request: NextRequest) {
  const authResult = await authorizeRoles(request, "admin");
  if (authResult) return authResult;
  return newRoom(request);
}