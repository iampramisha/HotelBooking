import mongoose, { Schema, Document } from "mongoose";
import { Room, User} from "@/models";

export interface IBooking extends Document {
  _id: any;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  room: {
    _id: string;
    name: string;
    image: string;
    pricePerNight: number;
  };
  checkInDate: Date;
  checkOutDate: Date;
  amountPaid: number;
  daysOfStay: number;
  paymentInfo: {
    id: string;
    status: string;
  };
  paidAt: Date;
  createdAt: Date;
}

const bookingSchema: Schema<IBooking> = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Room", // ✅ correct
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // ✅ fixed
  },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  amountPaid: { type: Number, required: true },
  daysOfStay: { type: Number, required: true },
  paymentInfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  paidAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
