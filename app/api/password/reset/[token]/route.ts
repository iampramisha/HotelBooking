import { resetPassword } from "@/backend/controllers/authControllers";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const params = await context.params;
  const token = params.token; // ✅ Grab token
  console.log("token from URL:", token);

  return resetPassword(request, token); // ✅ Pass as string
}
