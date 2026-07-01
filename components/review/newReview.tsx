"use client";

import { IRoom } from "@/backend/models/room";
import { useCreateReviewMutation } from "@/redux/api/roomApi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const StarRatings = dynamic(() => import("react-star-ratings"), { ssr: false });

interface Props {
  roomId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (room: IRoom) => void;
}

const NewReview = ({ roomId, open, onClose, onSuccess }: Props) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [createReview, { isLoading }] = useCreateReviewMutation();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      toast.error("Please log in to submit a review.");
      router.push("/login");
      return;
    }

    if (rating < 1) {
      toast.error("Please select a star rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment.");
      return;
    }

    const res = await createReview({
      roomId,
      body: { rating, comment: comment.trim() },
    });

    if ("data" in res && res.data?.room) {
      toast.success("Review submitted successfully.");
      onSuccess(res.data.room);
      setRating(0);
      setComment("");
      onClose();
      return;
    }

    const message =
      (res.error as { data?: { message?: string; errMessage?: string } })?.data
        ?.message ||
      (res.error as { data?: { message?: string; errMessage?: string } })?.data
        ?.errMessage ||
      "Failed to submit review.";
    toast.error(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close review modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Submit Your Review</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {status === "authenticated" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your rating
              </label>
              <StarRatings
                rating={rating}
                starRatedColor="#e61e4d"
                starHoverColor="#e61e4d"
                starEmptyColor="#d1d5db"
                changeRating={setRating}
                numberOfStars={5}
                starDimension="28px"
                starSpacing="4px"
                name="reviewRating"
              />
            </div>

            <div>
              <label htmlFor="review_comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your review
              </label>
              <textarea
                id="review_comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience staying at this hotel..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-semibold rounded-lg transition"
            >
              {isLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">You need to be logged in to leave a review.</p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition"
            >
              Log in to review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReview;
