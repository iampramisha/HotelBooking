// app/bookings/invoice/[id]/page.tsx
import Invoice from "@/components/invoice/invoice";
import { cookies } from "next/headers";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

const InvoicePage = async ({ params }: InvoicePageProps) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // Fetch booking data
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/bookings/${id}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  const data = await res.json();
  console.log("invoice data", data);

  // Pass the booking object to Invoice component
  return <Invoice booking={data?.booking} />;
};

export const metadata = {
  title: "Booking Invoice",
};

export default InvoicePage;
