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
  algorithm = "Interval Overlap",
  message,
  checkInDate,
  checkOutDate,
}: Props) => {
  if (!checkInDate || !checkOutDate) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-left">
        <p className="text-sm text-gray-500">
          Select check-in and check-out dates to run availability check
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Uses <span className="font-medium">{algorithm}</span> algorithm
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-left">
        <div className="flex items-center gap-2 text-blue-700">
          <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Running availability check...</span>
        </div>
        <p className="text-xs text-blue-500 mt-2">
          Checking for overlapping bookings using {algorithm} algorithm
        </p>
      </div>
    );
  }

  if (isAvailable === true) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-left">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold text-green-800">
            {message || "Room is available for selected dates"}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            {algorithm} ✓
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            0 overlapping bookings
          </span>
        </div>
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-left">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold text-red-800">
            {message || "Selected dates are already booked"}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            {algorithm} detected overlap
          </span>
          {overlappingCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {overlappingCount} conflicting booking{overlappingCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="text-xs text-red-600 mt-2">
          Rule: startA &lt; endB AND endA &gt; startB → dates overlap
        </p>
      </div>
    );
  }

  return null;
};

export default AvailabilityStatus;
