"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StarRatings from "react-star-ratings";
interface Recommendation {
  id: string;
  name: string;
  pricePerNight: number;
  category: string;
  address?: string;
  city?: string;
  ratings?: number;
  numOfReviews?: number;
  imageUrl?: string;
  similarityScore: number;
  algorithm: string;
}
interface Props {
  roomId: string;
}
const RecommendedRooms = ({ roomId }: Props) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/rooms/${roomId}/recommendations`);
        const data = await res.json();
        if (data.success) {
          setRecommendations(data.recommendations ?? []);
        }
      } catch {
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [roomId]);

  if (isLoading) {
    return (
      <section className="mt-10">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
          
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-1/3 mt-2" />
                <div className="h-8 bg-gray-100 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (recommendations.length === 0) return null;
  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">You might also like</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-md transition-shadow duration-200 group"
          >
            {/* Image */}
            <div className="relative w-full h-40">
              <Image
                src={room.imageUrl || "/images/default_room_image.jpg"}
                alt={room.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
           
              <div className="absolute top-2 right-2">
                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-white/90 text-gray-700 shadow-sm">
                  {room.category}
                </span>
              </div>
            </div>
     
            {/* Body */}
            <div className="flex flex-col flex-1 p-4">
              <h5 className="text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors line-clamp-1">
                <Link href={`/rooms/${room.id}`}>{room.name}</Link>
              </h5>
     
              {(room.city || room.address) && (
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                  {room.city || room.address}
                </p>
              )}
                 
              <p className="text-rose-600 font-bold mt-2 text-sm">
                Rs. {room.pricePerNight}{" "}
                <span className="font-normal text-gray-400 text-xs">/ night</span>
              </p>
      
              {room.ratings !== undefined && (
                <div className="flex items-center mt-1 gap-1">
                  <StarRatings
                    rating={room.ratings || 0}
                    starRatedColor="#e61e4d"
                    numberOfStars={5}
                    starDimension="12px"
                    starSpacing="1px"
                    name={`rating-${room.id}`}
                  />
                  <span className="text-gray-400 text-xs">({room.numOfReviews ?? 0})</span>
                </div>
              )}
               
              {/* Match bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Similarity</span>
                  <span>{Math.round(room.similarityScore * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-rose-500 transition-all duration-500"
                    style={{ width: `${Math.round(room.similarityScore * 100)}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/rooms/${room.id}`}
                className="mt-3 block bg-rose-600 hover:bg-rose-700 text-white font-medium text-center py-2 rounded-lg transition-colors text-xs"
              >
                View &amp; Book
              </Link>
            </div>
    
          </div>
        ))}</div>
    </section>
  );
};
export default RecommendedRooms;