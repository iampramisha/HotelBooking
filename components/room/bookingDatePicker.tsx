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
    algorithm?: string;
    message?: string;
  }>({});
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const [checkBookingAvailability, { data, isFetching }] =
    useLazyCheckBookingAvailabilityQuery();
  const { data: bookedDates } = useGetBookedDatesQuery({ roomId: room._id });

  useEffect(() => {
    if (data !== undefined) {
      setIsAvailable(data.isAvailable);
      setAvailabilityMeta({
        overlappingCount: data.overlappingCount,
        algorithm: data.algorithm,
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
    const transaction_uuid = `booking_${Date.now()}`;
    const total_amount = amount.toString();
    const product_code = process.env.NEXT_PUBLIC_ESEWA_MERCHANT_ID!;
    const esewaUrl = process.env.NEXT_PUBLIC_ESEWA_URL!;

    setPaymentInProgress(true);

    const res = await fetch("/api/esewa/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total_amount, transaction_uuid, product_code }),
    });

    const signatureData = await res.json();

    const fields: Record<string, string> = {
      amount: total_amount,
      tax_amount: "0",
      total_amount,
      transaction_uuid,
      product_code,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${window.location.origin}/booking/esewa/success?roomId=${room._id}&checkIn=${checkInDate.toISOString()}&checkOut=${checkOutDate.toISOString()}&days=${days}`,
      failure_url: `${window.location.origin}/booking/esewa/failed`,
      signed_field_names: signatureData.signedFieldNames,
      signature: signatureData.signature,
    };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = esewaUrl;

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
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
        ${room?.pricePerNight ?? 0}
        <span className="text-base font-normal text-gray-500"> / night</span>
      </p>

      {totalAmount > 0 && (
        <p className="text-sm text-gray-600 mt-1">
          {daysOfStay} night{daysOfStay > 1 ? "s" : ""} · Total{" "}
          <span className="font-semibold text-rose-600">${totalAmount}</span>
        </p>
      )}

      <hr className="my-4 border-gray-100" />

      <p className="text-sm font-medium text-gray-700 mb-3">
        Select Check-in & Check-out Dates
      </p>

      <DatePicker
        className="w-full border border-gray-200 rounded-lg p-2"
        selected={checkInDate}
        onChange={onChange}
        startDate={checkInDate}
        endDate={checkOutDate}
        minDate={new Date()}
        selectsRange
        excludeDates={excludedDates}
        inline
      />

      <AvailabilityStatus
        isLoading={isFetching}
        isAvailable={isAvailable}
        overlappingCount={availabilityMeta.overlappingCount}
        algorithm={availabilityMeta.algorithm}
        message={availabilityMeta.message}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      />

      <div className="mt-5">
        <button
          className={`w-full py-3 px-5 rounded-xl font-semibold text-white transition-colors ${
            isPayDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
          }`}
          disabled={isPayDisabled}
          onClick={bookRoom}
        >
          {paymentInProgress ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Redirecting to eSewa...
            </span>
          ) : (
            "Pay with eSewa"
          )}
        </button>

        {isAvailable === false && (
          <p className="text-xs text-gray-400 mt-2">
            Payment disabled until available dates are selected
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingDatePicker;
