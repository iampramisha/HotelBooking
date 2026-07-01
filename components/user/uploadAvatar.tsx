"use client"
import { useLazyUpdateSessionQuery, useUpdateSessionQuery, useUploadAvatarMutation } from "@/redux/api/userApi";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
// Lazy query = you trigger it manually, whenever you want.

// In your case: after avatar upload succeeds, you call updateSession() to fetch the freshest user data.

// It’s not tied to a button click — it’s tied to an event (success of mutation).

// Normal query = runs automatically on render.

// Use it when you always want the data as soon as the component loads, no manual trigger needed.
const UploadAvatar = () => {
    const dispatch=useAppDispatch();
    const router=useRouter();
    const [avatar,setAvatar]=useState("");
    const [avatarPreview,setAvatarPreview]=useState('/images/default_avatar.jpg');
const {user}=useAppSelector((state)=>state.auth);
const [uploadAvatar,{isLoading}]=useUploadAvatarMutation();
const { update } = useSession();

useEffect(() => {
  if (user?.avatar) {
    setAvatarPreview(user?.avatar?.url);
  }
}, [user]);

const onChange:React.ChangeEventHandler<HTMLInputElement>=(e)=>{
    const files=Array.from(e.target.files || []);
    const reader=new FileReader();
//     It’s a file input change handler for uploading images.

// Converts the selected file (e.target.files[0]) into a base64 Data URL using FileReader.

// Once reading is done (readyState === 2), it updates React state:

// setAvatar → stores the file as a string (for uploading to backend).

// setAvatarPreview → stores the file for immediate image preview in the UI.

// This allows users to see the selected image instantly before submitting.

// Essentially: select file → read as Data URL → update state → preview image
    reader.onload=()=>{
    if(reader.readyState === 2){
        setAvatar(reader.result as string);
setAvatarPreview(reader.result as string)
    }
    };
    reader.readAsDataURL(files[0])
}
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = { avatar };
    try {
      await uploadAvatar(userData).unwrap();
      update();
      toast.success("Profile Avatar uploaded");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.data?.errMessage || "Upload failed");
    }
  };



  return (
    <div className=" ">
      <div className="col-10 col-lg-8 w-full max-w-2xl">
        <form
          className="shadow rounded bg-white p-6"
        //   action="/submit-avatar-upload"
          method="POST"
          onSubmit={submitHandler}
          encType="multipart/form-data"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Upload Avatar
          </h2>

          <div className="form-group">
            <div className="flex items-center space-x-4">
  {/* Avatar preview */}
  <figure className="avatar">
    <img
      src={avatarPreview}
      className="rounded-full w-20 h-20 object-cover border"
      alt="avatar preview"
    />
  </figure>

  {/* Custom File Input */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Choose Avatar
    </label>

    <div className="flex items-center space-x-3">
      {/* Fake Button */}
      <label
        htmlFor="customFile"
        className="cursor-pointer px-4 py-2 bg-red-700 text-white text-sm rounded-md shadow hover:bg-red-80 transition"
      >
        Select File
      </label>

      {/* Show filename OR fallback */}
      <span className="text-sm text-gray-600 truncate max-w-[150px]">
        {avatar ? "File selected" : "No file chosen"}
      </span>
    </div>

    {/* Hidden Input */}
    <input
      type="file"
      name="avatar"
      id="customFile"
      accept="image/*"
      className="hidden"
      onChange={onChange}
    />
  </div>
</div>

          </div>

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
    "Upload Avatar"
  )}
</button>

        </form>
      </div>
    </div>
  );
};

export default UploadAvatar;
