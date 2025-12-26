// "use client";

// //Server Component fetch → no cookies → cannot get req.user.

// // Client Component fetch → cookies included → backend can read req.user.id.

// // That’s why you converted MyBookingsPage into a client component...as myBookings api needs userid
// "use client"
// import { useEffect, useState } from "react";
// import MyBookingsTable from "@/components/booking/MyBookings";
// import Error from "@/app/error";
// export const metadata={
//     title:'My Bookings'
// }
// export default function MyBookingsPage() {
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     const fetchBookings = async () => {
//         //Browsers automatically understand relative URLs (like /api/bookings/me) → it requests from the same origin.
//       const res = await fetch("/api/bookings/me", { credentials: "include" });
//       const json = await res.json();
//       setData(json);
//     };
//     fetchBookings();
//   }, []);

//   if (!data) return <p>Loading...</p>;
//   if (data?.errMessage) return <Error error={data} />;

//   return <MyBookingsTable data={data} />;
// }
import Error from '@/app/error';
import MyBookings from '@/components/booking/MyBookings';
import { cookies } from 'next/headers';
import React from 'react';

export const metadata = {
  title: 'My Bookings',
};

const getBookings = async (cookieHeader: string) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/bookings/me`, {
    headers: {
      cookie: cookieHeader, // forward cookies from browser
    },
    cache: 'no-cache',
  });
  return res.json();
};

const MyBookingsPage = async () => {
const cookieStore = await cookies();
const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  const data = await getBookings(cookieHeader);

  console.log("mybookedataas:", data);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <MyBookings data={data} />;
};

export default MyBookingsPage;
