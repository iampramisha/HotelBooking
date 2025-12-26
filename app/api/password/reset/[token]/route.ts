import { resetPassword } from "@/backend/controllers/authControllers";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, context: { params: { token: string } }) {
  const token = context.params.token; // ✅ Grab token
  console.log("token from URL:", token);

  return resetPassword(request, token); // ✅ Pass as string
}
