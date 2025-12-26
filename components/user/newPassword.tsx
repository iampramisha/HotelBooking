"use client";

import { useResetPasswordMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  token: string; // ✅ always a string now
}

const NewPassword = ({ token }: Props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { error, isSuccess, isLoading }] =
    useResetPasswordMutation();

  const router = useRouter();

  useEffect(() => {
    if (error && "data" in error) {
      toast.error((error as any)?.data?.errMessage);
    }
    if (isSuccess) {
      toast.success("Password reset was successful!");
      router.push("/login");
    }
  }, [error, isSuccess, router]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwords = { password, confirmPassword };
    resetPassword({ token, body: passwords }); // ✅ token is plain string
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
        <form
          onSubmit={submitHandler}
          className="bg-white shadow-md rounded-2xl p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            New Password
          </h2>

          {/* Password field */}
          <div className="mb-4">
            <label
              htmlFor="password_field"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password_field"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Confirm Password field */}
          <div className="mb-4">
            <label
              htmlFor="confirm_password_field"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password_field"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
