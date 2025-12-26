"use client"; // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { errMessage?: string }; // 👈 extend Error type
  reset?: () => void;
}) {
  console.log("errorrrr", error?.message, error?.errMessage);

  // Prefer custom errMessage, fallback to normal message
  const displayMessage = error?.errMessage || error?.message || "Unknown error";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{displayMessage}</h2>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          <span className="text-red-500">Oops!</span> Something went wrong!
        </p>
        <p className="text-gray-500 mb-4">Sorry for the inconvenience</p>
        <button
          onClick={() => reset?.()}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
