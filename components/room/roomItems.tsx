"use client";

import { RoomWithDistance } from "@/types/room";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarRatings from "react-star-ratings";

interface Props {
  room: RoomWithDistance;
  rank?: number;
}

const RoomItems = ({ room, rank }: Props) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 p-2">
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        <div className="relative w-full h-44 sm:h-48 md:h-52">
          <Image
            src={
              room?.images && room.images.length > 0
                ? room.images[0].url
                : "/images/default_room_image.jpg"
            }
            alt={room?.name || "Room image"}
            className="object-cover"
            fill
          />

          {rank !== undefined && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              #{rank} Nearest
            </span>
          )}

          {room.distanceKm !== undefined && (
            <span className="absolute top-3 right-3 bg-white/95 backdrop-blur text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {room.distanceKm} km
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4">
          <h5 className="text-lg font-semibold text-gray-800 hover:text-rose-600 transition-colors line-clamp-1">
            <Link href={`/rooms/${room?._id}`}>{room?.name}</Link>
          </h5>

          {(room?.location?.city || room?.address) && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-1">
              {room.location?.city || room.address}
            </p>
          )}

          <p className="text-rose-600 font-bold mt-2">
            ${room?.pricePerNight}{" "}
            <span className="font-normal text-gray-500 text-sm">/ night</span>
          </p>

          <div className="flex items-center mt-2 space-x-2 mb-3">
            <StarRatings
              rating={room?.ratings || 0}
              starRatedColor="#e61e4d"
              numberOfStars={5}
              starDimension="16px"
              starSpacing="2px"
              name="rating"
            />
            <span className="text-gray-500 text-xs">({room?.numOfReviews} reviews)</span>
          </div>

          <Link
            href={`/rooms/${room?._id}`}
            className="mt-auto bg-rose-600 hover:bg-rose-700 text-white font-semibold text-center py-2.5 rounded-lg transition-colors duration-300 text-sm"
          >
            View Details & Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomItems;
