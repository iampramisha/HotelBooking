"use client";

import {
  useLazyUpdateSessionQuery,
  useUpdateProfileMutation,
} from "@/redux/api/userApi";
import { setUser } from "@/redux/features/userSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [updateProfile, { isLoading, isSuccess, error }] =
    useUpdateProfileMutation();
  const [updateSession, { data }] = useLazyUpdateSessionQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      setName(currentUser?.name);
      setEmail(currentUser?.email);
    }
    if (error && "data" in error) {
      toast.error((error as any)?.data?.errMessage);
    }
    if (isSuccess) {
      // @ts-ignore

      updateSession();
        toast.success("Profile Updated");
      router.refresh();
    }
  }, [currentUser, error, isSuccess]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = { name, email };
    updateProfile(userData);
  };

  if (data) {
    dispatch(setUser(data?.user));
  }

  return (
    <form
      className="w-full max-w-3xl shadow rounded bg-white p-6 "
      onSubmit={submitHandler}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Update Profile
      </h2>

      <div className="mb-4">
        <label htmlFor="name_field" className="block text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name_field"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email_field" className="block text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email_field"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="btn form-btn w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
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
          "UPDATE"
        )}
      </button>
    </form>
  );
};

export default UpdateProfile;
