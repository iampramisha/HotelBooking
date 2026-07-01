import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConfig";
import User from "@/backend/models/user";
import { authorizeRoles } from "@/backend/middlewares/auth";
// GET /api/admin/users — all users (admin only)
export async function GET(req: NextRequest) {
  const authResult = await authorizeRoles(req, "admin");
  if (authResult) return authResult;
  await dbConnect();
  const users = await User.find({}).select("-password").sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    success: true,
    users,
    count: users.length,
  });
}
// DELETE /api/admin/users?id=<userId>
export async function DELETE(req: NextRequest) {
  const authResult = await authorizeRoles(req, "admin");
  if (authResult) return authResult;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: "User deleted" });
}
// PATCH /api/admin/users?id=<userId> — update user role
export async function PATCH(req: NextRequest) {
  const authResult = await authorizeRoles(req, "admin");
  if (authResult) return authResult;
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
  const body = await req.json();
  const user = await User.findByIdAndUpdate(id, { role: body.role }, { new: true }).select("-password");
  return NextResponse.json({ success: true, user });
}