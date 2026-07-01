"use client";

import React, { useState } from "react";
import { IRoom } from "@/backend/models/room";
import StarRatings from "react-star-ratings";
import RoomSlider from "./roomSlider";
import RoomFeatures from "./roomFeatures";
import BookingDatePicker from "./bookingDatePicker";
import NewReview from "../review/newReview";
import ListReviews from "../review/listReviews";
import RoomMap from "./roomMap";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RecommendedRooms from "./RecommendedRooms";

interface Props {
  data: {
    room: IRoom;
  };
}

const RoomDetails = ({ data }: Props) => {
  const [room, setRoom] = useState(data.room);
  const [showReviewModal, setShowReviewModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      {/* Room Name & Address */}
      <div>
        <h2 className="text-2xl font-semibold">
          {room?.name || "Lorem Ipsum Room"}
        </h2>
      <p className="text-gray-600">
        {room?.address || "1234 Lorem Ipsum Street, Lorem City"}
      </p>

      {/* Ratings */}
      <div className="ratings flex items-center gap-2">
        <StarRatings
          rating={room?.ratings || 0}
          starRatedColor="#e61e4d"
          numberOfStars={5}
          starDimension="22px"
          starSpacing="1px"
          name="rating"
        />
        <span className="no-of-reviews">({room?.numOfReviews || 0})</span>
      </div>

      {/* Room Image Slider */}
      <RoomSlider images={room?.images || []} />

      {/* Main content: Description + Booking + Map */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Description & Features */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700">
            {room?.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum nulla sit amet eros iaculis, id venenatis purus tempor."}
          </p>

          {/* Room Features */}
          <RoomFeatures room={room} />
        </div>

        {/* Right Column: Booking Card + Map */}
        <div className="flex-1 lg:max-w-md flex flex-col gap-6">
          <BookingDatePicker room={room} />

          {room?.location?.coordinates && (
            <RoomMap
              latitude={room.location.coordinates[1]}
              longitude={room.location.coordinates[0]}
              address={room.address || room.location.formattedAddress || ""}
            />
          )}
        </div>
      </div>

      {/* Review Section */}
      <div>
        <button
          type="button"
          onClick={() => setShowReviewModal(true)}
          className="btn form-btn px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition"
        >
          Submit Your Review
        </button>
      </div>

      <NewReview
        roomId={String(room._id)}
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSuccess={(updatedRoom) => setRoom(updatedRoom)}
      />

      <ListReviews reviews={room.reviews} numOfReviews={room.numOfReviews} />

      <div className="border-t border-gray-100 pt-6">
        <RecommendedRooms roomId={String(room._id)} />
      </div>
    </div>
  );
};

export default RoomDetails;