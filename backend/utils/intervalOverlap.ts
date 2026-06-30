export interface DateInterval {
  checkInDate: Date;
  checkOutDate: Date;
}

/**
 * Interval Overlap Algorithm
 * Two date ranges overlap when: startA < endB AND endA > startB
 * Used to prevent double-booking of hotel rooms.
 */
export function doIntervalsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && endA > startB;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  overlappingCount: number;
  algorithm: string;
  message: string;
}

/**
 * Check if a requested stay overlaps with any existing bookings.
 * Time complexity: O(n) where n = number of existing bookings
 */
export function checkBookingAvailability(
  requestedCheckIn: Date,
  requestedCheckOut: Date,
  existingBookings: DateInterval[]
): AvailabilityResult {
  const overlapping = existingBookings.filter((booking) =>
    doIntervalsOverlap(
      requestedCheckIn,
      requestedCheckOut,
      new Date(booking.checkInDate),
      new Date(booking.checkOutDate)
    )
  );

  const isAvailable = overlapping.length === 0;

  return {
    isAvailable,
    overlappingCount: overlapping.length,
    algorithm: "Interval Overlap",
    message: isAvailable
      ? "Room is available for the selected dates"
      : `Room is not available — ${overlapping.length} overlapping booking(s) found`,
  };
}
