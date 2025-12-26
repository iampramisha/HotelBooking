// app/utils/esewa.ts or src/utils/esewa.ts
import CryptoJS from "crypto-js";

export const generateEsewaSignature = (total_amount: string, transaction_uuid: string, product_code: string) => {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const secretKey = process.env.ESEWA_SECRET_KEY!;
  const signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(message, secretKey));
  return {
    signature,
    signedFieldNames: "total_amount,transaction_uuid,product_code",
  };
};
