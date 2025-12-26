
// "use client"
// import { IRoom } from '@/backend/models/room';
// import { calculateDaysOfStay } from '@/helper/helpers';
// import { useGetBookedDatesQuery, useLazyCheckBookingAvailabilityQuery, useNewBookingMutation } from '@/redux/api/bookingApi';
// import React, { useState, useEffect } from 'react';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// interface Props {
//   room: IRoom;
// }

// const BookingDatePicker = ({ room }: Props) => {
//   const [checkInDate, setCheckInDate] = useState<Date | null>(null);
//   const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
//   const [daysOfStay, setDaysOfStay] = useState(0);
//   const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
//   const [isPaid, setIsPaid] = useState(false);

//   // API hooks
//   const [newBooking, { isLoading: bookingLoading, isError }] = useNewBookingMutation();
//   const [checkBookingAvailability, { data, isLoading }] = useLazyCheckBookingAvailabilityQuery();
//   const { data: bookedDates, isLoading: bookedDatesLoading, refetch } = useGetBookedDatesQuery({ roomId: room._id });

//   useEffect(() => {
//     if (data !== undefined) {
//       setIsAvailable(data.isAvailable);
//       console.log("Availability data:", data);
//     }
//   }, [data]);

//   const onChange = (dates: [Date | null, Date | null]) => {
//     const [ci, co] = dates;
//     setCheckInDate(ci);
//     setCheckOutDate(co);
//     setIsPaid(false);

//     if (ci && co) {
//       const days = calculateDaysOfStay(ci, co);
//       setDaysOfStay(days);

//       checkBookingAvailability({
//         id: room._id,
//         checkInDate: ci.toISOString(),
//         checkOutDate: co.toISOString(),
//       });
//     }
//   };

//   const bookRoom = async () => {
//     if (!room?._id || !checkInDate || !checkOutDate || isAvailable === false || isPaid) return;

//     const bookingData = {
//       room: room._id,
//       checkInDate,
//       checkOutDate,
//       daysOfStay,
//       amountPaid: (room.pricePerNight ?? 0) * daysOfStay,
//       paymentInfo: { id: "test_payment", status: "succeeded" },
//     };

//     try {
//       await newBooking(bookingData).unwrap();
//       setIsPaid(true);

//       // 🔥 instantly refresh booked dates after success
//       await refetch();

//       // reset selection (optional)
//       setCheckInDate(null);
//       setCheckOutDate(null);
//     } catch (err) {
//       console.error("Booking failed", err);
//     }
//   };

//   // Disable booked dates in calendar
//   const excludedDates = bookedDates?.bookDates?.map((d: string) => new Date(d)) || [];

//   // Button disabled state
//   const isPayDisabled =
//     bookingLoading || isLoading || !checkInDate || !checkOutDate || isAvailable === false || isPaid;

//   return (
//     <div className="booking-card shadow p-4 text-center rounded-lg bg-white">
//       {/* Room price */}
//       <p className="price-per-night font-semibold text-lg">
//         ${room?.pricePerNight ?? 0} per night
//       </p>
//       <hr className="my-3" />

//       {/* Date Picker */}
//       <p className="mt-5 mb-3 font-medium">Select Check In and Check Out dates</p>
//       <DatePicker
//         className="w-full border rounded-lg p-2"
//         selected={checkInDate}
//         onChange={onChange}
//         startDate={checkInDate}
//         endDate={checkOutDate}
//         minDate={new Date()}
//         selectsRange
//         excludeDates={excludedDates}   // 🚀 disables already booked days
//         inline
//       />

//       {/* Pay button */}
//       <div className="mt-4 mb-3 flex justify-center">
//         <button
//           className={`btn py-3 px-5 rounded-full text-white transition-colors ${
//             isPayDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//           disabled={isPayDisabled}
//           onClick={bookRoom}
//         >
//           Pay
//         </button>
//       </div>

//       {/* Messages */}
//       {checkInDate && checkOutDate && isAvailable === false && !isLoading && (
//         <p className="mt-2 p-2 rounded-lg bg-red-100 text-red-700">
//           Selected dates are already booked.
//         </p>
//       )}
//       {checkInDate && checkOutDate && isAvailable === true && !isLoading && !isPaid && (
//         <p className="mt-2 p-2 rounded-lg bg-green-100 text-green-700 mb-4">
//           Room is available. You can book now.
//         </p>
//       )}
//       {checkInDate && checkOutDate && isLoading && (
//         <p className="mt-2 p-2 rounded-lg bg-gray-100 text-gray-700 mb-4">
//           Checking availability...
//         </p>
//       )}
//       {isPaid && (
//         <p className="mt-2 p-2 rounded-lg bg-green-50 text-green-800 font-medium mb-4">
//           Payment completed for the selected dates.
//         </p>
//       )}
//       {isError && (
//         <p className="mt-2 p-2 rounded-lg bg-red-50 text-red-800 font-medium mb-4">
//           Something went wrong during booking.
//         </p>
//       )}
//     </div>
//   );
// };

// export default BookingDatePicker;
// app/components/BookingDatePicker.tsx


// "use client";

// import { IRoom } from "@/backend/models/room";
// import { calculateDaysOfStay } from "@/helper/helpers";
// import { useGetBookedDatesQuery, useLazyCheckBookingAvailabilityQuery, useNewBookingMutation } from "@/redux/api/bookingApi";
// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { initiateEsewaPayment } from "@/backend/utils/esewa";

// interface Props {
//   room: IRoom;
// }

// const BookingDatePicker = ({ room }: Props) => {
//   const [checkInDate, setCheckInDate] = useState<Date | null>(null);
//   const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
//   const [daysOfStay, setDaysOfStay] = useState(0);
//   const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
//   const [paymentInProgress, setPaymentInProgress] = useState(false);

//   // RTK Query hooks
//   const [newBooking] = useNewBookingMutation();
//   const [checkBookingAvailability, { data, isLoading }] = useLazyCheckBookingAvailabilityQuery();
//   const { data: bookedDates, refetch } = useGetBookedDatesQuery({ roomId: room._id });

//   useEffect(() => {
//     if (data !== undefined) setIsAvailable(data.isAvailable);
//   }, [data]);

//   const onChange = (dates: [Date | null, Date | null]) => {
//     const [ci, co] = dates;
//     setCheckInDate(ci);
//     setCheckOutDate(co);

//     if (ci && co) {
//       const days = calculateDaysOfStay(ci, co);
//       setDaysOfStay(days);

//       checkBookingAvailability({
//         id: room._id,
//         checkInDate: ci.toISOString(),
//         checkOutDate: co.toISOString(),
//       });
//     }
//   };
// const bookRoom = () => {
//   if (!room?._id || !checkInDate || !checkOutDate || !isAvailable) return;

//   const days = calculateDaysOfStay(checkInDate, checkOutDate);
//   setDaysOfStay(days);

//   const amount = (room.pricePerNight ?? 0) * days;
//   const pid = `booking_${Date.now()}`;

//   // Convert dates to ISO strings
//   const pendingBooking = {
//     roomId: room._id,
//     checkInDate: checkInDate.toISOString(),
//     checkOutDate: checkOutDate.toISOString(),
//     daysOfStay: days.toString(),
//     amountPaid: amount.toString(),
//     pid,
//   };

//   // ✅ Log everything before initiating payment
//   console.log("Booking info:", pendingBooking);
//   console.log("Success URL:", `${window.location.origin}/booking/esewa/success`);
//   console.log("Failure URL:", `${window.location.origin}/booking/esewa/failed`);

//   // Store pending booking in localStorage
//   localStorage.setItem("pendingBooking", JSON.stringify(pendingBooking));

//   setPaymentInProgress(true);

//   // Initiate eSewa payment
//   initiateEsewaPayment(
//     amount.toString(), // string
//     pid,
//     `${window.location.origin}/booking/esewa/success`,
//     `${window.location.origin}/booking/esewa/failed`
//   );
// };



//   const excludedDates = bookedDates?.bookDates?.map((d: string) => new Date(d)) || [];
//   const isPayDisabled = !checkInDate || !checkOutDate || !isAvailable || paymentInProgress;

//   return (
//     <div className="booking-card shadow p-4 text-center rounded-lg bg-white">
//       <p className="price-per-night font-semibold text-lg">
//         ${room?.pricePerNight ?? 0} per night
//       </p>
//       <hr className="my-3" />
//       <p className="mt-5 mb-3 font-medium">Select Check In and Check Out dates</p>
//       <DatePicker
//         className="w-full border rounded-lg p-2"
//         selected={checkInDate}
//         onChange={onChange}
//         startDate={checkInDate}
//         endDate={checkOutDate}
//         minDate={new Date()}
//         selectsRange
//         excludeDates={excludedDates}
//         inline
//       />
//       <div className="mt-4 mb-3 flex justify-center">
//         <button
//           className={`btn py-3 px-5 rounded-full text-white transition-colors ${
//             isPayDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//           disabled={isPayDisabled}
//           onClick={bookRoom}
//         >
//           {paymentInProgress ? "Redirecting to Payment..." : "Pay"}
//         </button>
//       </div>
//       {checkInDate && checkOutDate && isAvailable === false && (
//         <p className="mt-2 p-2 rounded-lg bg-red-100 text-red-700">
//           Selected dates are already booked.
//         </p>
//       )}
//     </div>
//   );
// };

// export default BookingDatePicker;



// "use client";

// import { IRoom } from "@/backend/models/room";
// import { calculateDaysOfStay } from "@/helper/helpers";
// import { useLazyCheckBookingAvailabilityQuery } from "@/redux/api/bookingApi";
// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { generateEsewaSignature } from "@/backend/utils/esewa";

// interface Props {
//   room: IRoom;
// }

// const BookingDatePicker = ({ room }: Props) => {
//   const [checkInDate, setCheckInDate] = useState<Date | null>(null);
//   const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
//   const [daysOfStay, setDaysOfStay] = useState(0);
//   const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
//   const [paymentInProgress, setPaymentInProgress] = useState(false);

//   const [checkBookingAvailability, { data }] = useLazyCheckBookingAvailabilityQuery();

//   useEffect(() => {
//     if (data !== undefined) setIsAvailable(data.isAvailable);
//   }, [data]);

//   const onChange = (dates: [Date | null, Date | null]) => {
//     const [ci, co] = dates;
//     setCheckInDate(ci);
//     setCheckOutDate(co);

//     if (ci && co) {
//       const days = calculateDaysOfStay(ci, co);
//       setDaysOfStay(days);

//       checkBookingAvailability({
//         id: room._id,
//         checkInDate: ci.toISOString(),
//         checkOutDate: co.toISOString(),
//       });
//     }
//   };

//   const bookRoom = () => {
//     if (!room?._id || !checkInDate || !checkOutDate || !isAvailable) return;

//     const days = calculateDaysOfStay(checkInDate, checkOutDate);
//     setDaysOfStay(days);

//     const amount = (room.pricePerNight ?? 0) * days;
//     const transaction_uuid = `booking_${Date.now()}`;
//     const total_amount = amount; // include tax/service/delivery if needed
//     const product_code = process.env.NEXT_PUBLIC_ESEWA_MERCHANT_ID!;

//     const signature = generateEsewaSignature({ total_amount, transaction_uuid, product_code });

//     const pendingBooking = {
//       roomId: room._id,
//       checkInDate: checkInDate.toISOString(),
//       checkOutDate: checkOutDate.toISOString(),
//       daysOfStay: days.toString(),
//       amountPaid: amount.toString(),
//       transaction_uuid,
//     };
//     localStorage.setItem("pendingBooking", JSON.stringify(pendingBooking));

//     setPaymentInProgress(true);

//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // sandbox v2

//     const fields = {
//       amount,
//       tax_amount: 0,
//       total_amount,
//       transaction_uuid,
//       product_code,
//       product_service_charge: 0,
//       product_delivery_charge: 0,
//       success_url: `${window.location.origin}/booking/esewa/success`,
//       failure_url: `${window.location.origin}/booking/esewa/failed`,
//       signed_field_names: "total_amount,transaction_uuid,product_code",
//       signature,
//     };

//     Object.entries(fields).forEach(([key, value]) => {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = key;
//       input.value = value as string;
//       form.appendChild(input);
//     });

//     document.body.appendChild(form);
//     form.submit();
//   };

//   const excludedDates = []; // integrate your bookedDates if needed
//   const isPayDisabled = !checkInDate || !checkOutDate || !isAvailable || paymentInProgress;

//   return (
//     <div className="booking-card shadow p-4 text-center rounded-lg bg-white">
//       <p className="price-per-night font-semibold text-lg">
//         ${room?.pricePerNight ?? 0} per night
//       </p>
//       <hr className="my-3" />
//       <p className="mt-5 mb-3 font-medium">Select Check In and Check Out dates</p>
//       <DatePicker
//         className="w-full border rounded-lg p-2"
//         selected={checkInDate}
//         onChange={onChange}
//         startDate={checkInDate}
//         endDate={checkOutDate}
//         minDate={new Date()}
//         selectsRange
//         excludeDates={excludedDates}
//         inline
//       />
//       <div className="mt-4 mb-3 flex justify-center">
//         <button
//           className={`btn py-3 px-5 rounded-full text-white transition-colors ${
//             isPayDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//           disabled={isPayDisabled}
//           onClick={bookRoom}
//         >
//           {paymentInProgress ? "Redirecting to Payment..." : "Pay"}
//         </button>
//       </div>
//       {checkInDate && checkOutDate && isAvailable === false && (
//         <p className="mt-2 p-2 rounded-lg bg-red-100 text-red-700">
//           Selected dates are already booked.
//         </p>
//       )}
//     </div>
//   );
// };

// export default BookingDatePicker;
"use client";

import { IRoom } from "@/backend/models/room";
import { calculateDaysOfStay } from "@/helper/helpers";
import { useLazyCheckBookingAvailabilityQuery } from "@/redux/api/bookingApi";
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
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const [checkBookingAvailability, { data }] =
    useLazyCheckBookingAvailabilityQuery();

  useEffect(() => {
    if (data !== undefined) setIsAvailable(data.isAvailable);
  }, [data]);

  const onChange = (dates: [Date | null, Date | null]) => {
    const [ci, co] = dates;
    setCheckInDate(ci);
    setCheckOutDate(co);

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

    // Step 1: Get signature from API
    const res = await fetch("/api/esewa/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total_amount, transaction_uuid, product_code }),
    });

    const signatureData = await res.json();

    // Step 2: Prepare fields
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

    // 🔍 Log payload to check what’s being sent
    console.log("🟢 eSewa payload being sent:", fields);
    console.log("🔗 Submitting form to:", esewaUrl);

    // Step 3: Create and submit form
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

  const excludedDates: Date[] = [];
  const isPayDisabled =
    !checkInDate || !checkOutDate || !isAvailable || paymentInProgress;

  return (
    <div className="booking-card shadow p-4 text-center rounded-lg bg-white">
      <p className="price-per-night font-semibold text-lg">
        ${room?.pricePerNight ?? 0} per night
      </p>
      <hr className="my-3" />
      <p className="mt-5 mb-3 font-medium">
        Select Check In and Check Out dates
      </p>

      <DatePicker
        className="w-full border rounded-lg p-2"
        selected={checkInDate}
        onChange={onChange}
        startDate={checkInDate}
        endDate={checkOutDate}
        minDate={new Date()}
        selectsRange
        excludeDates={excludedDates}
        inline
      />

      <div className="mt-4 mb-3 flex justify-center">
        <button
          className={`btn py-3 px-5 rounded-full text-white transition-colors ${
            isPayDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={isPayDisabled}
          onClick={bookRoom}
        >
          {paymentInProgress ? "Redirecting to eSewa..." : "Pay with eSewa"}
        </button>
      </div>

      {checkInDate && checkOutDate && isAvailable === false && (
        <p className="mt-2 p-2 rounded-lg bg-red-100 text-red-700">
          Selected dates are already booked.
        </p>
      )}
    </div>
  );
};

export default BookingDatePicker;
