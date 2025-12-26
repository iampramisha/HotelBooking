import HomeComponent from "@/components/home";
import Error from "./error";
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
export const metadata = {
  title: "HomePage - BookIT",
};

// Fetch rooms based on searchParams object
const getRooms = async (searchParams: Record<string, string | string[] | undefined>) => {
  const urlParams = new URLSearchParams();

  if (searchParams.page) urlParams.append("page", searchParams.page as string);
  if (searchParams.location) urlParams.append("location", searchParams.location as string);

  const queryString = urlParams.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms?${queryString}`, {
    cache: "no-cache",
  });

  return res.json();
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Await searchParams in case it's a promise
  const params = await searchParams;

  const data = await getRooms(params);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <HomeComponent data={data} />;
}
