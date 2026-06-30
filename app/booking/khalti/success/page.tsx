"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function KhaltiSuccessPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState(
    "Processing your Khalti payment..."
  );
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Khalti redirects to return_url as a GET with query params:
        // ?pidx=...&txnId=...&amount=...&total_amount=...&status=Completed&mobile=...
        // &tidx=...&purchase_order_id=...&purchase_order_name=...&transaction_id=...
        // PLUS our custom params: roomId, checkIn, checkOut, days
        const urlParams = new URLSearchParams(window.location.search);

        const pidx = urlParams.get("pidx");
        const status = urlParams.get("status");
        const roomId = urlParams.get("roomId");
        const checkIn = urlParams.get("checkIn");
        const checkOut = urlParams.get("checkOut");
        const days = urlParams.get("days");
        const amount = urlParams.get("amount"); // in paisa from Khalti

        // Check if user canceled
        if (status === "User canceled") {
          setStatusMessage("Payment was canceled by the user.");
          setIsSuccess(false);
          return;
        }

        if (!pidx || !roomId || !checkIn || !checkOut || !days) {
          setStatusMessage("Missing payment or booking information.");
          setIsSuccess(false);
          return;
        }

        // Convert paisa to NPR for storage
        const amountInNPR = amount ? Number(amount) / 100 : 0;

        // Call our verify endpoint which does the Khalti lookup + saves booking
        const res = await fetch("/api/khalti/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // send cookies for JWT auth
          body: JSON.stringify({
            pidx,
            roomId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            daysOfStay: Number(days),
            amount: amountInNPR,
          }),
        });

        const result = await res.json();
        console.log("Khalti booking verification result:", result);

        if (result.success) {
          setStatusMessage("Booking successful! Payment confirmed. ✅");
          setIsSuccess(true);
          // Redirect to bookings page after 3 seconds
          setTimeout(() => {
            router.push("/bookings/me");
          }, 3000);
        } else {
          setStatusMessage("Booking failed: " + result.message);
          setIsSuccess(false);
        }
      } catch (err) {
        console.error("Khalti success page error:", err);
        setStatusMessage("An error occurred while confirming your booking.");
        setIsSuccess(false);
      }
    };

    processPayment();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {isSuccess === null && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <h1 className="text-xl font-semibold text-gray-700">
              {statusMessage}
            </h1>
            <p className="text-sm text-gray-400">
              Please wait, do not close this page.
            </p>
          </div>
        )}

        {isSuccess === true && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-700">
              Payment Successful!
            </h1>
            <p className="text-gray-600">{statusMessage}</p>
            <p className="text-sm text-gray-400">
              Redirecting to your bookings...
            </p>
          </div>
        )}

        {isSuccess === false && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-700">
              Payment Failed
            </h1>
            <p className="text-gray-600">{statusMessage}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}