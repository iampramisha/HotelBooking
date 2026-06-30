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

  const { rooms, resPerPage, filteredRoomsCount, algorithm, maxDistanceKm } = data;

  const heading = nearMe
    ? `${filteredRoomsCount} hotel${filteredRoomsCount !== 1 ? "s" : ""} near you`
    : location
      ? `${filteredRoomsCount} room${filteredRoomsCount !== 1 ? "s" : ""} found in ${location}`
      : "All Rooms";

  return (
    <div className="px-4 md:px-8 lg:px-16 pb-12">
      <section id="rooms" className="mt-5">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">{heading}</h2>

          {nearMe && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Sorted by nearest distance
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                Algorithm: {algorithm || "Haversine Distance"}
              </span>
              {maxDistanceKm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                  Within {maxDistanceKm} km
                </span>
              )}
            </div>
          )}
        </div>

        <Link
          href="/search"
          className="inline-flex items-center gap-1 mb-6 text-rose-600 hover:text-rose-800 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Link>

        {rooms?.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-600 font-medium">No rooms found</p>
            <p className="text-gray-400 text-sm mt-1">
              {nearMe
                ? "Try increasing the max distance or search by city instead."
                : "Try a different location or filters."}
            </p>
            <Link
              href="/search"
              className="inline-block mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition text-sm"
            >
              Search again
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-2 justify-start">
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

      <div className="mt-6 flex justify-center">
        <CustomPagination
          resPerPage={resPerPage}
          filteredRoomsCount={filteredRoomsCount}
        />
      </div>
    </div>
  );
};

export default Home;
