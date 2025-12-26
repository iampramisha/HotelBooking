"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Search = () => {
  const [location, setLocation] = useState("New York");
  const [guests, setGuests] = useState("1");
  const [category, setCategory] = useState("King");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();

    const queryString = [
      location && `location=${encodeURIComponent(location)}`,
      guests && `guestCapacity=${encodeURIComponent(guests)}`,
      category && `category=${encodeURIComponent(category)}`,
    ]
      .filter(Boolean)
      .join("&");

    router.push(`/?${queryString}`);
  };

  const roomOptions = ["King", "Single", "Twins"];

  return (
    <div className="wrapper mt-5 flex justify-center">
      <div className="w-11/12 lg:w-1/2">
        <form
          className="shadow-lg bg-white p-6 rounded-lg border border-gray-300"
          onSubmit={handleSubmit}
        >
          <h2 className="mb-3 text-xl font-semibold">Search Rooms</h2>

          {/* Location */}
          <div className="mt-3">
            <label
              htmlFor="location_field"
              className="block mb-1 font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location_field"
              placeholder="new york"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Guests */}
          <div className="mt-3">
            <label
              htmlFor="guest_field"
              className="block mb-1 font-medium text-gray-700"
            >
              No. of Guests
            </label>
            <select
              id="guest_field"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="form-select w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div className="mt-3">
            <label
              htmlFor="room_type_field"
              className="block mb-1 font-medium text-gray-700"
            >
              Room Type
            </label>
            <select
              id="room_type_field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {roomOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn form-btn w-full py-2 mt-4 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Search;
