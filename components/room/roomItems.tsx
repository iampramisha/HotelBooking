"use client";
import { RoomWithDistance } from "@/types/room";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const StarRatings = dynamic(() => import("react-star-ratings"), { ssr: false });

interface Props {
  room: RoomWithDistance;
  rank?: number;
}

const RoomItems = ({ room, rank }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-md transition-shadow duration-200 group">
      <div className="relative w-full h-48">
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
          <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
            #{rank} Nearest
          </span>
        )}
        {room.distanceKm !== undefined && (
          <span className="absolute top-2 right-2 bg-white text-gray-700 text-xs font-medium px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {room.distanceKm} km
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h5 className="text-base font-semibold text-gray-800 group-hover:text-rose-600 transition-colors line-clamp-1">
          <Link href={`/rooms/${room?._id}`}>{room?.name}</Link>
        </h5>
        
        {(room?.location?.city || room?.address) && (
          <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">
            {room.location?.city || room.address}
          </p>
        )}
        <p className="text-rose-600 font-bold mt-2">
          Rs. {room?.pricePerNight}{" "}
          <span className="font-normal text-gray-400 text-sm">/ night</span>
        </p>

        <div className="flex items-center mt-2 gap-1.5">
          <StarRatings
            rating={room?.ratings || 0}
            starRatedColor="#e61e4d"
            numberOfStars={5}
            starDimension="14px"
            starSpacing="1px"
            name="rating"
          />
          <span className="text-gray-400 text-xs">({room?.numOfReviews})</span>
        </div>
        <Link
          href={`/rooms/${room?._id}`}
          className="mt-auto mt-3 block bg-rose-600 hover:bg-rose-700 text-white font-medium text-center py-2 rounded-lg transition-colors text-sm"
        >
          View &amp; Book
        </Link>
      </div>
    </div>
  );
};
export default RoomItems;