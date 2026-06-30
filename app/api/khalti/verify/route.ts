// app/api/khalti/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConfig";
import Booking from "@/backend/models/booking";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Check user authentication
    const authCheck = await isAuthenticatedUser(req);
    if (authCheck) return authCheck;

    const user = req.user;
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated properly" },
        { status: 401 }
      );
    }

    // 2️⃣ Parse request body
    const { pidx, roomId, checkInDate, checkOutDate, daysOfStay, amount } =
      await req.json();

    if (!pidx) {
      return NextResponse.json(
        { success: false, message: "Missing pidx for payment verification" },
        { status: 400 }
      );
    }

    // 3️⃣ Lookup payment status from Khalti sandbox
    const khaltiSecretKey = process.env.KHALTI_SECRET_KEY!;

    const lookupResponse = await fetch(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      }
    );

    const lookupData = await lookupResponse.json();

    if (!lookupResponse.ok) {
      console.error("Khalti lookup error:", lookupData);
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
          error: lookupData,
        },
        { status: 400 }
      );
    }

    // 4️⃣ Validate payment status - ONLY "Completed" is success
    if (lookupData.status !== "Completed") {
      return NextResponse.json(
        {
          success: false,
          message: `Payment not completed. Status: ${lookupData.status}`,
        },
        { status: 400 }
      );
    }

    // 5️⃣ Connect to DB and save booking
    await dbConnect();

    // Convert paisa back to NPR for storage
    const amountPaid = amount
      ? Number(amount)
      : lookupData.total_amount / 100;

    const booking = await Booking.create({
      room: roomId,
      user: user._id,
      checkInDate,
      checkOutDate,
      daysOfStay: Number(daysOfStay),
      amountPaid,
      paymentInfo: {
        id: lookupData.transaction_id || pidx,
        status: "succeeded",
      },
      paidAt: new Date(),
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Khalti verify error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed", error },
      { status: 500 }
    );
  }
}