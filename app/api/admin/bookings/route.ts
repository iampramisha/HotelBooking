import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConfig";
import Booking from "@/backend/models/booking";
import { authorizeRoles } from "@/backend/middlewares/auth";
// GET /api/admin/bookings — all bookings (admin only)
export async function GET(req: NextRequest) {
  const authResult = await authorizeRoles(req, "admin");
  if (authResult) return authResult;
  await dbConnect();
  const bookings = await Booking.find({})
    .populate("user", "name email")
    .populate("room", "name pricePerNight")
    .sort({ createdAt: -1 })
    .lean();
  const totalAmount = bookings.reduce(
    (sum: number, b: any) => sum + (b.amountPaid || 0),
    0
  );
  return NextResponse.json({
    success: true,
    bookings,
    totalAmount,
    count: bookings.length,
  });
}
// DELETE /api/admin/bookings?id=<bookingId>
export async function DELETE(req: NextRequest) {
  const authResult = await authorizeRoles(req, "admin");
  if (authResult) return authResult;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
  await Booking.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: "Booking deleted" });
}