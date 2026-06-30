const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Haversine Distance Algorithm
 * Calculates the great-circle distance between two GPS coordinates.
 * Time complexity: O(1) per pair
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.asin(Math.sqrt(a));
  return EARTH_RADIUS_KM * c;
}

export interface RoomWithDistance<T> {
  room: T;
  distanceKm: number;
}

/**
 * Sort rooms by nearest distance from user location.
 * Time complexity: O(n log n) due to sorting
 */
export function sortRoomsByDistance<T extends { location?: { coordinates?: number[] } }>(
  rooms: T[],
  userLat: number,
  userLng: number,
  maxDistanceKm = 100
): RoomWithDistance<T>[] {
  return rooms
    .filter((room) => room.location?.coordinates?.length === 2)
    .map((room) => {
      const [lng, lat] = room.location!.coordinates!;
      return {
        room,
        distanceKm: haversineDistance(userLat, userLng, lat, lng),
      };
    })
    .filter(({ distanceKm }) => distanceKm <= maxDistanceKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function roundDistance(km: number): number {
  return Math.round(km * 10) / 10;
}
