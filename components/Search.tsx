"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Search = () => {
  const [location, setLocation] = useState("Kathmandu");
  const [guests, setGuests] = useState("1");
  const [category, setCategory] = useState("");
  const [maxDistance, setMaxDistance] = useState("50");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const router = useRouter();

  const buildQuery = (extra: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    if (extra.lat) params.set("lat", extra.lat);
    if (extra.lng) params.set("lng", extra.lng);
    if (extra.nearMe) params.set("nearMe", extra.nearMe);
    if (location && !extra.nearMe) params.set("location", location);
    if (guests) params.set("guestCapacity", guests);
    if (category) params.set("category", category);
    if (extra.nearMe && maxDistance) params.set("maxDistance", maxDistance);
    return params.toString();
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?${buildQuery()}`);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const query = buildQuery({
          lat: latitude.toString(),
          lng: longitude.toString(),
          nearMe: "true",
        });
        setGeoLoading(false);
        router.push(`/?${query}`);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location permission denied. Please allow location access.");
        } else {
          setGeoError("Could not detect your location. Try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const roomOptions = ["", "King", "Single", "Twins"];

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-rose-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Stay</h1>
          <p className="text-gray-600 mt-2">
            Search by city or discover hotels nearest to you using GPS
          </p>
        </div>

        {/* Near Me — Haversine Algorithm */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-rose-100 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Hotels Near Me</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Uses <span className="font-medium text-rose-600">Haversine Distance Algorithm</span> to rank hotels by proximity to your GPS location
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max distance (km)
            </label>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {[10, 25, 50, 100, 200].map((km) => (
                <option key={km} value={km}>
                  Within {km} km
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleNearMe}
            disabled={geoLoading}
            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {geoLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Detecting your location...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Find Nearest Hotels
              </>
            )}
          </button>

          {geoError && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{geoError}</p>
          )}
        </div>

        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-4 text-sm text-gray-400 font-medium">OR SEARCH BY CITY</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Text search form */}
        <form
          onSubmit={handleTextSearch}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4"
        >
          <div>
            <label htmlFor="location_field" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location_field"
              placeholder="e.g. Kathmandu, Pokhara, Lalitpur"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guest_field" className="block text-sm font-medium text-gray-700 mb-1">
                Guests
              </label>
              <select
                id="guest_field"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="room_type_field" className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                id="room_type_field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="">Any type</option>
                {roomOptions.filter(Boolean).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition"
          >
            Search Rooms
          </button>
        </form>
      </div>
    </div>
  );
};

export default Search;
