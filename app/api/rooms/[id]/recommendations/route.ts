import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConfig";
import Room from "@/backend/models/room";
import { getRecommendations } from "@/backend/utils/recommendation";
/**
 * GET /api/rooms/[id]/recommendations
 *
 * Returns up to 4 recommended rooms similar to the given room,
 * computed using the Cosine Similarity algorithm on feature vectors.
 *
 * Feature vector includes: amenities (wifi, breakfast, AC, pets, cleaning),
 * room category, normalized price, and normalized guest capacity.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;
  // Fetch the target room
  const targetRoom = await Room.findById(id).lean();
  if (!targetRoom) {
    return NextResponse.json(
      { success: false, message: "Room not found" },
      { status: 404 }
    );
  }
  // Fetch all other rooms for comparison
  const allRooms = await Room.find({}).lean();
  const recommendations = getRecommendations(targetRoom as any, allRooms as any[], 4);
  return NextResponse.json({
    success: true,
    recommendations,
    algorithm: "Cosine Similarity (Content-Based Filtering)",
    totalCompared: allRooms.length - 1,
  });
}