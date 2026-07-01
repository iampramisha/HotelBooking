// app/api/khalti/initiate/route.ts
import { NextRequest, NextResponse } from "next/server";
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
    const { amount, roomId, checkInDate, checkOutDate, daysOfStay, roomName } =
      await req.json();

    if (!amount || !roomId || !checkInDate || !checkOutDate || !daysOfStay) {
      return NextResponse.json(
        { success: false, message: "Missing required booking details" },
        { status: 400 }
      );
    }

    const khaltiSecretKey = process.env.KHALTI_SECRET_KEY!;
    const siteUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // 3️⃣ Build the return_url with booking context as query params
    const returnUrl = `${siteUrl}/booking/khalti/success?roomId=${roomId}&checkIn=${encodeURIComponent(
      checkInDate
    )}&checkOut=${encodeURIComponent(checkOutDate)}&days=${daysOfStay}`;

    // 4️⃣ Khalti requires amount in PAISA (multiply NPR by 100)
    const amountInPaisa = Math.round(Number(amount) * 100);

    const purchase_order_id = `booking_${roomId}_${Date.now()}`;
    const purchase_order_name = roomName
      ? `Hotel Room - ${roomName}`
      : "Hotel Room Booking";

    // 5️⃣ Initiate payment with Khalti sandbox
    const khaltiResponse = await fetch(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: returnUrl,
          website_url: siteUrl,
          amount: amountInPaisa,
          purchase_order_id,
          purchase_order_name,
          customer_info: {
            name: user.name || "Guest User",
            email: user.email || "guest@example.com",
            phone: (user as any).phone || "9800000000",
          },
        }),
      }
    );

    const khaltiData = await khaltiResponse.json();

    if (!khaltiResponse.ok) {
      console.error("Khalti initiation error:", khaltiData);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initiate Khalti payment",
          error: khaltiData,
        },
        { status: 500 }
      );
    }

    // khaltiData = { pidx, payment_url, expires_at, expires_in }
    return NextResponse.json({
      success: true,
      payment_url: khaltiData.payment_url,
      pidx: khaltiData.pidx,
    });
  } catch (error) {
    console.error("Khalti initiate error:", error);
    return NextResponse.json(
      { success: false, message: "Payment initiation failed", error },
      { status: 500 }
    );
  }
}