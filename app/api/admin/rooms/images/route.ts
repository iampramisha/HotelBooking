import { NextRequest, NextResponse } from "next/server";
import { upload_file, delete_file } from "@/backend/utils/cloudinary";
import { authorizeRoles } from "@/backend/middlewares/auth";
import Room from "@/backend/models/room";
import dbConnect from "@/backend/config/dbConfig";
// POST /api/admin/rooms/images — upload images for a room
export async function POST(req: NextRequest) {
  const authResult = await authorizeRoles(req, "admin");
  if (authResult) return authResult;
  await dbConnect();
  const body = await req.json();
  const { roomId, images } = body; // images: string[] of base64 data URIs
  if (!roomId || !images || !Array.isArray(images) || images.length === 0) {
    return NextResponse.json(
      { success: false, message: "roomId and images[] are required" },
      { status: 400 }
    );
  }
  const room = await Room.findById(roomId);
  if (!room) {
    return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
  }
  // Upload each image to Cloudinary
  const uploadedImages = await Promise.all(
    images.map((img: string) => upload_file(img, "bookit/rooms"))
  );
  // Append to existing images (don't overwrite)
  room.images = [...(room.images || []), ...uploadedImages];
  await room.save();
  return NextResponse.json({ success: true, images: room.images });
}
// DELETE /api/admin/rooms/images — remove a single image by public_id
export async function DELETE(req: NextRequest) {
  const authResult = await authorizeRoles(req, "admin");
  if (authResult) return authResult;
  await dbConnect();
  const body = await req.json();
  const { roomId, public_id } = body;
  if (!roomId || !public_id) {
    return NextResponse.json(
      { success: false, message: "roomId and public_id required" },
      { status: 400 }
    );
  }
  const room = await Room.findById(roomId);
  if (!room) {
    return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
  }
  // Delete from Cloudinary
  await delete_file(public_id);
  // Remove from room images array
  room.images = (room.images || []).filter((img) => img.public_id !== public_id);
  await room.save();
  return NextResponse.json({ success: true, images: room.images });
}