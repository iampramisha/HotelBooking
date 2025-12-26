"use client";

import React from "react";
import { IRoom } from "@/backend/models/room";
import CustomPagination from "./layout/CustomPagination";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RoomItems from "./room/roomItems";

interface Props {
  data: {
    success: boolean;
    resPerPage: number;
    filteredRoomsCount: number;
    rooms: IRoom[];
  };
}

const Home = ({ data }: Props) => {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");

  const { rooms, resPerPage, filteredRoomsCount } = data;

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <section id="rooms" className="mt-5">
        <h2 className="mb-3 text-2xl font-semibold stays-heading">
          {location
            ? `${rooms?.length} rooms found in ${location}`
            : "All Rooms"}
        </h2>

        <Link
          href="/search"
          className="inline-block mb-4 text-rose-600 hover:text-red-800"
        >
          <i className="fa fa-arrow-left mr-1"></i> Back to Search
        </Link>

        {rooms?.length === 0 ? (
          <div className="alert alert-danger mt-5 w-full text-center">
            <b>No Rooms.</b>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-2 justify-start">
            {rooms?.map((room) => (
              <RoomItems key={room._id as string} room={room} />
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
