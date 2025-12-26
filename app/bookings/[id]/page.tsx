import BookingDetails from "@/components/booking/bookingDetails";
import { cookies } from "next/headers";

interface BookingDetailsPageProps {
  params: Promise<{ id: string }>;
}

const BookingDetailsPage = async ({ params }: BookingDetailsPageProps) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/bookings/${id}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  const data = await res.json();
  console.log("dataab", data);

  return <BookingDetails booking={data?.booking} />; // ✅ use singular
};

export default BookingDetailsPage;
