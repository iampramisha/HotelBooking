// app/api/esewa/verify/route.ts
import { NextResponse, NextRequest } from "next/server";
import CryptoJS from "crypto-js";
import dbConnect from "@/backend/config/dbConfig";
import Booking from "@/backend/models/booking";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Check user authentication
    const authCheck = await isAuthenticatedUser(req);
    if (authCheck) return authCheck; // 401 if not logged in

    const user = req.user; // possibly undefined
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated properly" },
        { status: 401 }
      );
    }

    // 2️⃣ Get request body
    const data = await req.json();
    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signature,
      roomId,
      checkInDate,
      checkOutDate,
      daysOfStay,
    } = data;

    // 3️⃣ Verify eSewa signature
    const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names`;
    const secretKey = process.env.ESEWA_SECRET_KEY!;
    const expectedSignature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(message, secretKey)
    );

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    if (status !== "COMPLETE") {
      return NextResponse.json(
        { success: false, message: "Payment incomplete" },
        { status: 400 }
      );
    }

    // 4️⃣ Connect to DB
    await dbConnect();

    // 5️⃣ Save booking
    const booking = await Booking.create({
      room: roomId,
      user: user._id, // ✅ safe now
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid: Number(total_amount),
      paymentInfo: { id: transaction_uuid, status: "succeeded" },
      paidAt: new Date(),
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Verification failed", error },
      { status: 500 }
    );
  }
}
