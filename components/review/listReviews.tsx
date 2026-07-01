"use client";

import { IReview } from "@/backend/models/room";
import React from "react";
import dynamic from "next/dynamic";

const StarRatings = dynamic(() => import("react-star-ratings"), { ssr: false });

interface PopulatedUser {
  name?: string;
  avatar?: { url?: string };
}

interface ReviewItem extends Omit<IReview, "user"> {
  user?: PopulatedUser;
}

interface Props {
  reviews?: ReviewItem[];
  numOfReviews?: number;
}

const ListReviews = ({ reviews = [], numOfReviews = 0 }: Props) => {
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="reviews w-full lg:w-3/4 mb-10">
      <h3 className="text-xl font-semibold mb-2">
        {numOfReviews} Review{numOfReviews !== 1 ? "s" : ""}
      </h3>
      <hr className="mb-4" />

      {sortedReviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review this hotel.</p>
      ) : (
        sortedReviews.map((review, index) => {
          const userName =
            typeof review.user === "object" && review.user?.name
              ? review.user.name
              : "Guest";
          const avatarUrl =
            typeof review.user === "object" && review.user?.avatar?.url
              ? review.user.avatar.url
              : "/images/default_avatar.jpg";

          return (
            <div key={`${userName}-${index}`} className="review-card my-3">
              <div className="flex items-start gap-4">
                <img
                  src={avatarUrl}
                  alt={userName}
                  width={60}
                  height={60}
                  className="rounded-full object-cover w-[60px] h-[60px]"
                />
                <div className="flex-1">
                  <StarRatings
                    rating={review.rating || 0}
                    starRatedColor="#e61e4d"
                    numberOfStars={5}
                    starDimension="18px"
                    starSpacing="2px"
                    name={`review-${index}`}
                  />
                  <p className="review_user mt-1 text-sm text-gray-700 font-medium">
                    by {userName}
                  </p>
                  {review.createdAt && (
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  <p className="review_comment mt-2 text-gray-600">{review.comment}</p>
                </div>
              </div>
              {index < sortedReviews.length - 1 && <hr className="my-4" />}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ListReviews;
