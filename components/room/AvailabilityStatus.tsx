"use client";
import React from "react";
interface Props {
  isLoading: boolean;
  isAvailable: boolean | null;
  overlappingCount?: number;
  algorithm?: string;
  message?: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
}
const AvailabilityStatus = ({
  isLoading,
  isAvailable,
  overlappingCount = 0,
  message,
  checkInDate,
  checkOutDate,
}: Props) => {
  if (!checkInDate || !checkOutDate) {
    return (
      <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200 text-left">
        <p className="text-sm text-gray-500">
          Select your check-in and check-out dates to see availability.
        </p>
      </div>
    );
  }
  if (isLoading) {
    return (

      <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-left">
        <div className="flex items-center gap-2 text-rose-700">
          <span className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span className="text-sm font-medium">Checking availability...</span>
        </div>

      </div>
    );
  }
  if (isAvailable === true) {
    return (
      <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-left">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold text-green-800">

            {message || "This room is available for your selected dates."}
          </p>
        </div>

      </div>
    );
  }
  if (isAvailable === false) {
    return (
      <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-left">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">
              {message || "This room is already booked for the selected dates."}
            </p>
            {overlappingCount > 0 && (
              <p className="text-xs text-red-600 mt-0.5">
                {overlappingCount} existing booking{overlappingCount > 1 ? "s" : ""} conflict
                {overlappingCount > 1 ? "" : "s"} with your dates. Please choose different dates.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};
export default AvailabilityStatus;