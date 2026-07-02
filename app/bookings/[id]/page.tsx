import BookingDetails from "@/components/booking/bookingDetails";
import { getBookingDetails } from "@/backend/controllers/bookingControllers";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";

interface BookingDetailsPageProps {
  params: Promise<{ id: string }>;
}

const BookingDetailsPage = async ({ params }: BookingDetailsPageProps) => {
  const { id } = await params;
  const cookieStore = await cookies();

  // Build a synthetic request carrying the auth cookies so isAuthenticatedUser works
  const fakeUrl = `http://localhost/api/bookings/${id}`;
  const fakeReq = new NextRequest(fakeUrl, {
    headers: { cookie: cookieStore.toString() },
  });

  // Run auth middleware — if it returns a response, the user isn't logged in
  const authResult = await isAuthenticatedUser(fakeReq);
  if (authResult) {
    return <BookingDetails booking={null as any} />;
  }


  // Call controller directly — no HTTP round-trip, works in production
  const res = await getBookingDetails(fakeReq, {
    params: Promise.resolve({ id }),
  });
  const data = await res.json();

  return <BookingDetails booking={data?.booking} />;
};

export default BookingDetailsPage;
