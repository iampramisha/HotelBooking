"use client";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, error, isSuccess }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (error && "data" in error) {
      toast.error((error as any)?.data?.errMessage);
    }
    if (isSuccess) {
      toast.success("Password reset email sent!");
      router.refresh();
    }
  }, [error, isSuccess, router]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = { email };
    forgotPassword(userData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
        <form
          className="bg-white shadow-md rounded-2xl p-6"
          onSubmit={submitHandler} // ✅ FIXED
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Forgot Password
          </h2>

          <div className="mb-4">
            <label
              htmlFor="email_field"
              className="block text-gray-700 font-medium mb-2"
            >
              Enter Email
            </label>
            <input
              type="email"
              id="email_field"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex justify-center items-center"
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
              "Send Email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
