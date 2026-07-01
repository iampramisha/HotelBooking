"use client";
import { IRoom } from "@/backend/models/room";
import CustomPagination from "./layout/CustomPagination";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RoomItems from "./room/roomItems";
import { RoomWithDistance } from "@/types/room";
interface Props {
  data: {
    success: boolean;
    resPerPage: number;
    filteredRoomsCount: number;
    rooms: RoomWithDistance[];
    nearMe?: boolean;
    algorithm?: string;
    maxDistanceKm?: number;
    userLocation?: { lat: number; lng: number };
  };
}
const Home = ({ data }: Props) => {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const nearMe = searchParams.get("nearMe") === "true" || data?.nearMe;
  const { rooms, resPerPage, filteredRoomsCount, maxDistanceKm } = data;
  const heading = nearMe
    ? `${filteredRoomsCount} hotel${filteredRoomsCount !== 1 ? "s" : ""} near you`
    : location
      ? `${filteredRoomsCount} result${filteredRoomsCount !== 1 ? "s" : ""} in "${location}"`
      : "All Rooms";
  return (
    <div className="px-4 md:px-8 lg:px-16 pb-12">
      <section id="rooms" className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{heading}</h2>
            {nearMe && maxDistanceKm && (
              <p className="text-sm text-gray-500 mt-0.5">
                Sorted by distance · within {maxDistanceKm} km
              </p>
            )}
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-800 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Search
          </Link>
        </div>
        {rooms?.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-700 font-semibold text-lg">No rooms found</p>
            <p className="text-gray-400 text-sm mt-1">
              {nearMe
                ? "No hotels found within range. Try increasing the distance."
                : location
                  ? `We couldn't find any rooms in "${location}". Check the spelling or try a nearby city.`
                  : "No rooms are available at the moment."}
            </p>
            <Link
              href="/search"
              className="inline-block mt-5 px-5 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition"
            >
              Try a new search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rooms?.map((room, index) => (
              <RoomItems
                key={room._id as string}
                room={room}
                rank={nearMe ? index + 1 : undefined}
              />
            ))}
          </div>
        )}
      </section>
      <div className="mt-8 flex justify-center">
        <CustomPagination
          resPerPage={resPerPage}
          filteredRoomsCount={filteredRoomsCount}
        />
      </div>
    </div>
  );
};
export default Home;