"use client";
import { useEffect, useState } from "react";

export default function EsewaSuccessPage() {
  const [statusMessage, setStatusMessage] = useState("Processing your eSewa payment...");

  useEffect(() => {
    const sendBooking = async () => {
      try {
      const search = window.location.search.substring(1); // remove initial ?
const parts = search.split("?"); // split on second ?
const queryString = parts.join("&"); // replace second ? with &
const urlParams = new URLSearchParams(queryString);

const roomId = urlParams.get("roomId");
const checkIn = urlParams.get("checkIn");
const checkOut = urlParams.get("checkOut");
const days = urlParams.get("days");
const dataEncoded = urlParams.get("data");

        if (!roomId || !checkIn || !checkOut || !days || !dataEncoded) {
          setStatusMessage("Missing booking data.");
          return;
        }

        const decodedData = JSON.parse(atob(dataEncoded));

        const payload = {
          ...decodedData,
          roomId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          daysOfStay: Number(days),
        };

        const res = await fetch("/api/esewa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // send cookies to get JWT
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log("Booking verification result:", result);

        if (result.success) {
          setStatusMessage("Booking successful! ✅ Saved to DB.");
        } else {
          setStatusMessage("Booking failed: " + result.message);
        }
      } catch (err) {
        console.error(err);
        setStatusMessage("Booking failed due to an error.");
      }
    };

    sendBooking();
  }, []);

  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold">{statusMessage}</h1>
      {statusMessage === "Processing your eSewa payment..." && (
        <p className="mt-4">Please wait, do not close this page.</p>
      )}
    </div>
  );
}
