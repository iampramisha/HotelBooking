import { generateEsewaSignature } from "@/backend/utils/esewa";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { total_amount, transaction_uuid, product_code } = await req.json();
    const { signature, signedFieldNames } = generateEsewaSignature(total_amount, transaction_uuid, product_code);

    return NextResponse.json({ signature, signedFieldNames });
  } catch (error) {
    console.error("Error generating signature:", error);
    return NextResponse.json({ error: "Signature generation failed" }, { status: 400 });
  }
}
