import { NextRequest, NextResponse } from "next/server";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import dbConnect from "../config/dbConfig";
import Booking, { IBooking } from "../models/booking";

import Moment from "moment";
import {extendMoment} from "moment-range";
import errorHandler from "../utils/errorHandler";
import { Room, User ,booking} from "@/models";

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

  const bookings: IBooking[] = await Booking.find({
    room: roomId,
    $and: [
      { checkInDate: { $lt: checkOutDate } },
      { checkOutDate: { $gt: checkInDate } },
    ],
  });

  const isAvailable: boolean = bookings.length === 0;
  return NextResponse.json({ isAvailable });
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
    if (!req.user || booking.user?._id?.toString() !== req?.user?._id.toString()) {
      throw new errorHandler("You cannot view this booking", 403);
    }

    return NextResponse.json({
      booking,
    });
  }
);
