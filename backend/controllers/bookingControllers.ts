import { NextRequest, NextResponse } from "next/server";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import dbConnect from "../config/dbConfig";
import Booking, { IBooking } from "../models/booking";

import Moment from "moment";
import {extendMoment} from "moment-range";
import errorHandler from "../utils/errorHandler";
import { Room, User ,booking} from "@/models";
import { checkBookingAvailability } from "../utils/intervalOverlap";

const moment=extendMoment(Moment)
export const newBooking=catchAsyncErrors(async(req:NextRequest)=>{
    await dbConnect();
    const body=await req.json();
    const {room,checkInDate,checkOutDate,daysOfStay,amountPaid,paymentInfo}=body;
const booking=await Booking.create({
    room,
    user:req.user?._id,checkInDate,checkOutDate,daysOfStay,amountPaid,paymentInfo,
    paidAt:Date.now()
})
return NextResponse.json({
    booking
})
})
export const checkRoomBookingAvailability = catchAsyncErrors(async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const roomId = searchParams.get("roomId") as string;
  const checkInDate = new Date(searchParams.get("checkInDate") as string);
  const checkOutDate = new Date(searchParams.get("checkOutDate") as string);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return NextResponse.json(
      { success: false, message: "Invalid check-in or check-out date" },
      { status: 400 }
    );
  }

  if (checkInDate >= checkOutDate) {
    return NextResponse.json(
      { success: false, message: "Check-out must be after check-in" },
      { status: 400 }
    );
  }

  const bookings: IBooking[] = await Booking.find({ room: roomId });

  const result = checkBookingAvailability(checkInDate, checkOutDate, bookings);

  return NextResponse.json({
    success: true,
    isAvailable: result.isAvailable,
    overlappingCount: result.overlappingCount,
    algorithm: result.algorithm,
    message: result.message,
  });
});
export const getBookDates =catchAsyncErrors(async(req:NextRequest)=>{
    await dbConnect();
    const {searchParams}=new URL(req.url);
    const roomId=searchParams.get("roomId");
    const bookings=await Booking.find({room:roomId});
    const bookDates=bookings.flatMap((booking)=>Array.from(moment.range(moment(booking.checkInDate),moment(booking.checkOutDate)).by('day')));
    return NextResponse.json({bookDates})



}) 
export const myBookings=catchAsyncErrors(async(req:NextRequest)=>{
    await dbConnect();
    const bookings=await Booking.find({user: req?.user?._id});
    return NextResponse.json({
        bookings,
    })
});

export const getBookingDetails = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }> }) => {
    // Await params if it's a promise
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;

    const booking = await Booking.findById(resolvedParams.id).populate("user room");

    // Ensure req.user exists
    if (!req.user || booking.user?._id?.toString() !== String(req?.user?._id)) {
      throw new errorHandler("You cannot view this booking", 403);
    }

    return NextResponse.json({
      booking,
    });
  }
);
