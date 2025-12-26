import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConfig";
import Room, { IRoom } from "../models/room";
import errorHandler from "@/backend/utils/errorHandler";
import  catchAsyncErrors  from "@/backend/middlewares/catchAsyncErrors";
import APIFilters from "../utils/apiFilters";

// GET all rooms
export const allRooms = async (req: NextRequest, params?: any) => {
  await dbConnect();
  const resPerPage: number = 4;

  const { searchParams } = new URL(req.url);
  const queryStr: any = {};
  searchParams.forEach((value, key) => (queryStr[key] = value));

  const roomsCount: number = await Room.countDocuments();

  // Apply search & filters
  const apiFilters = new APIFilters(Room, queryStr).search().filter();

  // Count filtered rooms BEFORE pagination
  const filteredRoomsCount: number = await apiFilters.query.clone().countDocuments();

  // Apply pagination AFTER counting
  apiFilters.pagination(resPerPage);

  // Fetch only paginated results
  const rooms: IRoom[] = await apiFilters.query.clone().exec();

  console.log("current page:", queryStr.page || 1, "rooms fetched:", rooms.length);

  return NextResponse.json({
    success: true,
    filteredRoomsCount,
    roomsCount,
    resPerPage,
    rooms,
  });
};

export const newRoom = async (req: NextRequest) => {
  await dbConnect(); // <== add this line

  const body = await req.json();
  const room = await Room.create(body);
  return NextResponse.json({
    success: true,
    room,
  });
};

export const getRoomDetails = catchAsyncErrors(
  async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    await dbConnect();

    const { id } = await context.params;  // Await params because it's a Promise
    const room = await Room.findById(id);

    if (!room) {
   throw new errorHandler('Room not found', 404);
    }

    // // Remove the throw unless you want to test error handling
    //  throw new errorHandler("Hello", 400);

    return NextResponse.json({
      success: true,
      room,
    });
  }
);

export const updateRoom = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Note: params is a Promise
) => {
  await dbConnect();

  // Await the params first
  const { id } = await params;

  // Find the room
  let room = await Room.findById(id);
  if (!room) throw new errorHandler("Room not found", 404);

  // Get request body
  const body = await req.json();

  // Update fields and save to trigger pre-save middleware (geocoding)
  Object.assign(room, body);
  await room.save();

  return NextResponse.json({
    success: true,
    room,
  });
};

export const deleteRoom = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect(); // Ensure DB is connected

  const room = await Room.findById(params.id);
  if (!room) {
   throw new errorHandler('Room not found', 404);
  }
//todo
//delete images associated with the room
  await room.deleteOne(); // or Room.findByIdAndDelete(params.id)

  return NextResponse.json({
    success: true,
    message: "Room deleted successfully",
  });
};

