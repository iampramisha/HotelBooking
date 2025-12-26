"use client";
import { IRoom } from "@/backend/models/room";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarRatings from "react-star-ratings";

interface Props {
  room: IRoom;
}

const RoomItems = ({ room }: Props) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 p-2">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
        
        {/* Image */}
        <div className="relative w-full h-44 sm:h-48 md:h-52">
          <Image
            src={
              room?.images && room.images.length > 0
                ? room.images[0].url
                : "/images/default_room_image.jpg"
            }
            alt="Room image"
            className="object-cover rounded-t-lg"
            fill
          />
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          <h5 className="text-lg font-semibold text-gray-800 hover:text-red-600 transition-colors">
            <Link href={`/rooms/${room?._id}`}>{room?.name}</Link>
          </h5>

          <p className="text-rose-600 font-bold mt-2">
            ${room?.pricePerNight} <span className="font-normal text-gray-500">/ night</span>
          </p>

          {/* Rating */}
          <div className="flex items-center mt-2 space-x-2 mb-2">
            <StarRatings
              rating={room?.ratings || 0}
              starRatedColor="#e61e4d"
              numberOfStars={5}
              starDimension="18px"
              starSpacing="2px"
              name="rating"
            />
            <span className="text-gray-500 text-sm">({room?.numOfReviews} Reviews)</span>
          </div>

          {/* View Button */}
        <Link
  href={`/rooms/${room?._id}`}
  className="mt-auto bg-rose-600 hover:bg-rose-900 text-white font-semibold text-center py-2 rounded-md transition-colors duration-300"
>
  View Details
</Link>

        </div>
      </div>
    </div>
  );
};

export default RoomItems;
