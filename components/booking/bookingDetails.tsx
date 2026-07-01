"use client";

import React from "react";
import Link from "next/link";

interface IImage {
  url: string;
  public_id: string;
}

interface IRoom {
  _id: string;
  name: string;
  images: IImage[];
  pricePerNight: number;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
}

interface IPaymentInfo {
  id: string;
  status: string;
}

interface IBooking {
  _id: string;
  user: IUser;
  room: IRoom;
  checkInDate: string;
  checkOutDate: string;
  daysOfStay: number;
  amountPaid: number;
  paymentInfo: IPaymentInfo;
}

interface BookingDetailsProps {
  booking: IBooking;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {
  if (!booking) return <p className="text-center mt-10">Booking not found</p>;

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Booking # {booking._id}</h2>
          <Link
            href={`/bookings/invoice/${booking._id}`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <i className="fa fa-print mr-2"></i> Invoice
          </Link>
        </div>

        {/* User Info */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-red-700">User Info</h4>
          <table className="w-full border border-gray-200 text-left">
            <tbody>
              <tr className="border-b">
                <th className="px-4 py-2 font-medium">Name:</th>
                <td className="px-4 py-2">{booking.user?.name}</td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-2 font-medium">Email:</th>
                <td className="px-4 py-2">{booking.user?.email}</td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-2 font-medium">Amount Paid:</th>
                <td className="px-4 py-2">Rs. {booking.amountPaid.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Booking Info */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-red-700">Booking Info</h4>
          <table className="w-full border border-gray-200 text-left">
            <tbody>
              <tr className="border-b">
                <th className="px-4 py-2 font-medium">Check In:</th>
                <td className="px-4 py-2">
                  {new Date(booking.checkInDate).toLocaleString("en-US")}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-2 font-medium">Check Out:</th>
                <td className="px-4 py-2">
                  {new Date(booking.checkOutDate).toLocaleString("en-US")}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-2 font-medium">Days of Stay:</th>
                <td className="px-4 py-2">{booking.daysOfStay}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Info */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-red-700">Payment Info</h4>
          <table className="w-full border border-gray-200 text-left">
            <tbody>
              <tr className="border-b">
                <th className="px-4 py-2 font-medium">Status:</th>
                <td className="px-4 py-2">
                  <span
                    className={`font-bold ${
                      booking.paymentInfo?.status === "succeeded"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {booking.paymentInfo?.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Booked Room */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-red-700">Booked Room</h4>
          <hr className="mb-4" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-24 h-16 flex-shrink-0">
                <img
                  src={booking.room?.images?.[0]?.url || "/placeholder.jpg"}
                  alt={booking.room?.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <Link
                  href={`/room/${booking.room?._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {booking.room?.name}
                </Link>
              </div>
              <div className="w-24 text-right">
                Rs. {booking.room?.pricePerNight.toFixed(2)}
              </div>
              <div className="w-24 text-right">
                {booking.daysOfStay} Day(s)
              </div>
            </div>
          </div>
          <hr className="mt-4" />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
