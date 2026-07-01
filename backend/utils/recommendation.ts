/**
 * Content-Based Filtering Recommendation Algorithm
 *
 * Recommends hotels that are mathematically similar to a given room,
 * based on the amenities and features of that room.
 *
 * Approach:
 *   1. Build a "feature vector" for each room (e.g., [wifi:1, AC:1, pool:0, ...])
 *   2. Calculate the Cosine Similarity between the target room's vector
 *      and every other room's vector.
 *   3. Return the top N rooms with the highest similarity score.
 *
 * Cosine Similarity Formula:
 *   similarity(A, B) = (A · B) / (|A| * |B|)
 *   where A · B is the dot product, and |A|, |B| are the magnitudes.
 *
 * Time Complexity: O(n * f) where n = number of rooms, f = number of features.
 * Space Complexity: O(n)
 */
export interface RoomFeatureVector {
  id: string;
  name: string;
  pricePerNight: number;
  category: string;
  address?: string;
  city?: string;
  ratings?: number;
  numOfReviews?: number;
  imageUrl?: string;
  vector: number[];
}
/**
 * Feature keys in the order they appear in the feature vector.
 * The order MUST remain consistent across all calls.
 */
const FEATURE_KEYS = [
  "isInternet",
  "isBreakfast",
  "isAirConditioned",
  "isPetsAllowed",
  "isRoomCleaning",
  "isKingCategory",   // category === 'King'
  "isSingleCategory", // category === 'Single'
  "isTwinsCategory",  // category === 'Twins'
  "priceNormalized",  // price scaled between 0-1 relative to others
  "capacityNormalized", // guestCapacity scaled
];
export function buildFeatureVector(
  room: {
    isInternet?: boolean;
    isBreakfast?: boolean;
    isAirConditioned?: boolean;
    isPetsAllowed?: boolean;
    isRoomCleaning?: boolean;
    category?: string;
    pricePerNight?: number;
    guestCapacity?: number;
  },
  maxPrice: number,
  maxCapacity: number
): number[] {
  return [
    room.isInternet ? 1 : 0,
    room.isBreakfast ? 1 : 0,
    room.isAirConditioned ? 1 : 0,
    room.isPetsAllowed ? 1 : 0,
    room.isRoomCleaning ? 1 : 0,
    room.category === "King" ? 1 : 0,
    room.category === "Single" ? 1 : 0,
    room.category === "Twins" ? 1 : 0,
    maxPrice > 0 ? (room.pricePerNight ?? 0) / maxPrice : 0,
    maxCapacity > 0 ? (room.guestCapacity ?? 1) / maxCapacity : 0,
  ];
}
/**
 * Dot product of two equal-length vectors.
 */
function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}
/**
 * Euclidean magnitude (length) of a vector.
 */
function magnitude(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}
/**
 * Cosine Similarity between two vectors (value between -1 and 1, usually 0 to 1 here).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}
export interface RecommendationResult {
  id: string;
  name: string;
  pricePerNight: number;
  category: string;
  address?: string;
  city?: string;
  ratings?: number;
  numOfReviews?: number;
  imageUrl?: string;
  similarityScore: number; // 0 to 1
  algorithm: string;
}
/**
 * Main function: Given a target room and a pool of candidate rooms,
 * returns the top `limit` most similar rooms sorted by cosine similarity.
 */
export function getRecommendations(
  targetRoom: {
    _id: string;
    isInternet?: boolean;
    isBreakfast?: boolean;
    isAirConditioned?: boolean;
    isPetsAllowed?: boolean;
    isRoomCleaning?: boolean;
    category?: string;
    pricePerNight?: number;
    guestCapacity?: number;
  },
  allRooms: Array<{
    _id: string;
    name?: string;
    isInternet?: boolean;
    isBreakfast?: boolean;
    isAirConditioned?: boolean;
    isPetsAllowed?: boolean;
    isRoomCleaning?: boolean;
    category?: string;
    pricePerNight?: number;
    guestCapacity?: number;
    address?: string;
    location?: { city?: string };
    ratings?: number;
    numOfReviews?: number;
    images?: Array<{ url: string }>;
  }>,
  limit = 4
): RecommendationResult[] {
  // Exclude the target room itself from candidates
  const candidates = allRooms.filter(
    (r) => String(r._id) !== String(targetRoom._id)
  );
  if (candidates.length === 0) return [];
  // Find global max values for normalization
  const maxPrice = Math.max(...candidates.map((r) => r.pricePerNight ?? 0), 1);
  const maxCapacity = Math.max(...candidates.map((r) => r.guestCapacity ?? 1), 1);
  // Build the target room's feature vector
  const targetVector = buildFeatureVector(targetRoom, maxPrice, maxCapacity);
  // Score each candidate room
  const scored = candidates.map((room) => {
    const candidateVector = buildFeatureVector(room, maxPrice, maxCapacity);
    const score = cosineSimilarity(targetVector, candidateVector);
    return {
      id: String(room._id),
      name: room.name ?? "Unknown Room",
      pricePerNight: room.pricePerNight ?? 0,
      category: room.category ?? "",
      address: room.address,
      city: room.location?.city,
      ratings: room.ratings,
      numOfReviews: room.numOfReviews,
      imageUrl: room.images?.[0]?.url,
      similarityScore: Math.round(score * 100) / 100,
      algorithm: "Cosine Similarity (Content-Based Filtering)",
    };
  });
  // Sort descending by similarity score
  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  // Return top N, excluding rooms with 0 similarity (completely unrelated)

  // Return top N, excluding rooms below 50% similarity threshold
  return scored.filter((r) => r.similarityScore >= 0.5).slice(0, limit);
}