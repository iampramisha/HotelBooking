import HomeComponent from "@/components/home";
import Error from "./error";
import 'leaflet/dist/leaflet.css';
import { NextRequest } from "next/server";
import { allRooms } from "@/backend/controllers/roomControllers";

export const metadata = {
  title: "HomePage - BookIT",
};

const getRooms = async (searchParams: Record<string, string | string[] | undefined>) => {
  const urlParams = new URLSearchParams();

  const passThrough = [
    "page",
    "location",
    "lat",
    "lng",
    "nearMe",
    "maxDistance",
    "guestCapacity",
    "category",
    "checkInDate",
    "checkOutDate",
  ];

  passThrough.forEach((key) => {
    const value = searchParams[key];
    if (value && typeof value === "string") {
      urlParams.append(key, value);
    }
  });

  // Call the controller directly — avoids broken NEXT_PUBLIC_API_URL in production
  const fakeUrl = `http://localhost/api/rooms?${urlParams.toString()}`;
  const fakeReq = new NextRequest(fakeUrl);
  const res = await allRooms(fakeReq);
  return res.json();
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const data = await getRooms(params);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <HomeComponent data={data} />;
}
