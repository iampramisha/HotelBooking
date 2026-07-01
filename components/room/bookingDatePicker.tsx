"use client";
import { IRoom } from "@/backend/models/room";
import { calculateDaysOfStay } from "@/helper/helpers";
import {
  useGetBookedDatesQuery,
  useLazyCheckBookingAvailabilityQuery,
} from "@/redux/api/bookingApi";
import AvailabilityStatus from "@/components/room/AvailabilityStatus";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface Props {
  room: IRoom;
}
const BookingDatePicker = ({ room }: Props) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [daysOfStay, setDaysOfStay] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMeta, setAvailabilityMeta] = useState<{
    overlappingCount?: number;
    message?: string;
  }>({});
  const [payError, setPayError] = useState("");
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [checkBookingAvailability, { data, isFetching }] =
    useLazyCheckBookingAvailabilityQuery();
  const { data: bookedDates } = useGetBookedDatesQuery({ roomId: room._id });
  useEffect(() => {
    if (data !== undefined) {
      setIsAvailable(data.isAvailable);
      setAvailabilityMeta({
        overlappingCount: data.overlappingCount,
        message: data.message,
      });
    }
  }, [data]);
  const onChange = (dates: [Date | null, Date | null]) => {
    const [ci, co] = dates;
    setCheckInDate(ci);
    setCheckOutDate(co);
    setIsAvailable(null);
    setAvailabilityMeta({});
    if (ci && co) {
      const days = calculateDaysOfStay(ci, co);
      setDaysOfStay(days);
      checkBookingAvailability({
        id: room._id,
        checkInDate: ci.toISOString(),
        checkOutDate: co.toISOString(),
      });
    }
  };
  const bookRoom = async () => {
    if (!room?._id || !checkInDate || !checkOutDate || !isAvailable) return;
    const days = calculateDaysOfStay(checkInDate, checkOutDate);
    const amount = (room.pricePerNight ?? 0) * days;
    setPaymentInProgress(true);
    setPayError("");
    try {
      const res = await fetch("/api/khalti/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        credentials: "include",
        body: JSON.stringify({
          amount,
          roomId: room._id,
          roomName: room.name,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          daysOfStay: days,
        }),
      });
      const data = await res.json();
      if (data.success && data.payment_url) {

        window.location.href = data.payment_url;
      } else {
        setPayError("Payment could not be started. Please try again or contact support.");
        setPaymentInProgress(false);
      }
    } catch {
      setPayError("A network error occurred. Check your connection and try again.");
      setPaymentInProgress(false);
    }
  };
  const excludedDates =
    bookedDates?.bookDates?.map((d: string) => new Date(d)) || [];
  const isPayDisabled =
    !checkInDate || !checkOutDate || !isAvailable || paymentInProgress;
  const totalAmount =
    checkInDate && checkOutDate && daysOfStay > 0
      ? (room.pricePerNight ?? 0) * daysOfStay
      : 0;
  return (
    <div className="booking-card shadow-lg p-5 text-center rounded-2xl bg-white border border-gray-100">
      <p className="price-per-night font-bold text-2xl text-gray-900">
        Rs. {room?.pricePerNight ?? 0}
        <span className="text-base font-normal text-gray-500"> / night</span>
      </p>
      {totalAmount > 0 && (
        <p className="text-sm text-gray-600 mt-1">
          {daysOfStay} night{daysOfStay > 1 ? "s" : ""} · Total{" "}
          <span className="font-semibold text-rose-600">Rs. {totalAmount}</span>
        </p>
      )}
        isLoading={isFetching}
        isAvailable={isAvailable}
        overlappingCount={availabilityMeta.overlappingCount}
        message={availabilityMeta.message}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      />

      <div className="mt-5 space-y-2">
        <button
          className={`w-full py-3 px-5 rounded-xl font-semibold text-white transition-colors ${
            isPayDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-rose-600 hover:bg-rose-700"
          }`}
          disabled={isPayDisabled}
          onClick={bookRoom}
        >
          {paymentInProgress ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Redirecting to payment...
            </span>
          ) : (
            "Book & Pay"
          )}
        </button>
        {payError && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {payError}
          </p>
        )}
        {!checkInDate || !checkOutDate ? (
          <p className="text-xs text-gray-400 text-center">
            Please select dates to continue
          </p>
        ) : isAvailable === false ? (
          <p className="text-xs text-gray-400 text-center">
            Room is unavailable for selected dates
          </p>
        ) : null}
      </div>
    </div>
  );
};
export default BookingDatePicker;