import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConfig";
import Room, { IRoom } from "../models/room";
import errorHandler from "@/backend/utils/errorHandler";
import  catchAsyncErrors  from "@/backend/middlewares/catchAsyncErrors";
import APIFilters from "../utils/apiFilters";
import { roundDistance, sortRoomsByDistance } from "../utils/haversine";
import { geocodeAddress, locationFromGeocodeResult } from "../utils/geocodeAddress";

/** Backfill coordinates for rooms saved before geocoding worked. */
async function resolveRoomCoordinates(rooms: IRoom[]): Promise<IRoom[]> {
  const resolved: IRoom[] = [];

  for (const room of rooms) {
    if (room.location?.coordinates?.length === 2) {
      resolved.push(room);
      continue;
    }

    if (!room.address) {
      resolved.push(room);
      continue;
    }

    const loc = await geocodeAddress(room.address);
    if (loc) {
      const location = locationFromGeocodeResult(loc);
      await Room.findByIdAndUpdate(room._id, { location });
      room.location = location;
    }

    resolved.push(room);
  }

  return resolved;
}

// GET all rooms
export const allRooms = async (req: NextRequest, params?: any) => {
  await dbConnect();
  const isUrlAdmin = req.nextUrl?.pathname?.includes('/api/admin') || req.url.includes('/api/admin');
  const resPerPage: number = isUrlAdmin ? 8 : 4;

  const { searchParams } = new URL(req.url);
  const queryStr: any = {};
  searchParams.forEach((value, key) => (queryStr[key] = value));

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const maxDistance = Number(searchParams.get("maxDistance")) || 100;
  const nearMe = searchParams.get("nearMe") === "true" || (!!lat && !!lng);

  const roomsCount: number = await Room.countDocuments();

  // Apply search & filters
  const apiFilters = new APIFilters(Room, queryStr).search().filter();

  const currentPage = Math.max(1, Number(queryStr.page) || 1);

  if (nearMe && lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (isNaN(userLat) || isNaN(userLng)) {
      return NextResponse.json(
        { success: false, message: "Invalid latitude or longitude" },
        { status: 400 }
      );
    }

    const allFilteredRooms: IRoom[] = await apiFilters.query.clone().exec();
    const roomsWithCoords = await resolveRoomCoordinates(allFilteredRooms);
    const sortedByDistance = sortRoomsByDistance(
      roomsWithCoords,
      userLat,
      userLng,
      maxDistance
    );

    const filteredRoomsCount = sortedByDistance.length;
    const skip = resPerPage * (currentPage - 1);
    const paginated = sortedByDistance.slice(skip, skip + resPerPage);

    const rooms = paginated.map(({ room, distanceKm }) => {
      const roomObj = room.toObject ? room.toObject() : { ...room };
      return {
        ...roomObj,
        distanceKm: roundDistance(distanceKm),
      };
    });

    return NextResponse.json({
      success: true,
      filteredRoomsCount,
      roomsCount,
      resPerPage,
      rooms,
      nearMe: true,
      algorithm: "Haversine Distance",
      userLocation: { lat: userLat, lng: userLng },
      maxDistanceKm: maxDistance,
    });
  }

  // Count filtered rooms BEFORE pagination
  const filteredRoomsCount: number = await apiFilters.query.clone().countDocuments();

  // Apply pagination AFTER counting
  apiFilters.pagination(resPerPage);

  // Fetch only paginated results
  const rooms: IRoom[] = await apiFilters.query.clone().exec();

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
    const room = await Room.findById(id).populate({
      path: "reviews.user",
      select: "name avatar",
    });

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

export const createReview = catchAsyncErrors(
  async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    await dbConnect();

    const { id } = await context.params;
    const { rating, comment } = await req.json();
    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      throw new errorHandler("Please provide a rating between 1 and 5", 400);
    }

    if (!comment?.trim()) {
      throw new errorHandler("Please provide a review comment", 400);
    }

    const room = await Room.findById(id);
    if (!room) {
      throw new errorHandler("Room not found", 404);
    }

    const userId = String(req.user!._id);
    const reviews = room.reviews || [];
    const existingReviewIndex = reviews.findIndex(
      (review: { user: any; }) => String(review.user) === userId
    );

    if (existingReviewIndex >= 0) {
      const oldRating = reviews[existingReviewIndex].rating || 0;
      reviews[existingReviewIndex].rating = numericRating;
      reviews[existingReviewIndex].comment = comment.trim();
      reviews[existingReviewIndex].createdAt = new Date();

      const count = room.numOfReviews || reviews.length;
      const total = (room.ratings || 0) * count - oldRating + numericRating;
      room.ratings = count > 0 ? total / count : numericRating;
    } else {
      reviews.push({
        user: req.user!._id as any,
        rating: numericRating,
        comment: comment.trim(),
        createdAt: new Date(),
      });
      room.reviews = reviews;

      const count = room.numOfReviews || 0;
      room.ratings = ((room.ratings || 0) * count + numericRating) / (count + 1);
      room.numOfReviews = count + 1;
    }

    await room.save();

    const updatedRoom = await Room.findById(id).populate({
      path: "reviews.user",
      select: "name avatar",
    });

    return NextResponse.json({
      success: true,
      room: updatedRoom,
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
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect(); // Ensure DB is connected

  const { id } = await params;
  const room = await Room.findById(id);
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