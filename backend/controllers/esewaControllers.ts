import dbConnect from "@/backend/config/dbConfig";
import Booking from "@/backend/models/booking";
import CryptoJS from "crypto-js";

export const verifyEsewaPaymentV2 = async (data: any) => {
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

  const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names`;
  const secretKey = process.env.ESEWA_SECRET_KEY!;
  const expectedSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(message, secretKey));

  if (expectedSignature !== signature) {
    throw new Error("Invalid signature. Payment might be tampered.");
  }

  if (status !== "COMPLETE") {
    throw new Error(`Payment not complete. Status: ${status}`);
  }

  await dbConnect();

  return Booking.create({
    room: roomId,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid: total_amount,
    paymentInfo: { id: transaction_uuid, status: "succeeded" },
    paidAt: new Date(),
  });
};
