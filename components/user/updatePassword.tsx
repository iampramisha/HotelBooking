"use client"
import { updatePassword } from "@/backend/controllers/authControllers";
import { useUpdatePasswordMutation, useUpdateProfileMutation } from "@/redux/api/userApi";
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UpdatePassword = () => {
    const [password,setPassword]=useState('' )
    const[oldPassword,setOldPassword]=useState("")
    const [UpdatePassword,{isLoading}]=useUpdatePasswordMutation();
    const router=useRouter();
    const { update } = useSession();

    const submitHandler=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const passwords={password,oldPassword};
        try {
            await UpdatePassword(passwords).unwrap();
            update();
            toast.success('Password changed!');
            router.refresh();
        } catch (err: any) {
            toast.error(err?.data?.errMessage || "Password update failed");
        }
    }
    
  return (
    <div className="flex  min-h-screen">
      <div className="w-full max-w-xl">
        <form className="shadow rounded bg-white p-6" onSubmit={submitHandler}>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Change Password
          </h2>

          {/* Old Password */}
          <div className="mb-4">
            <label
              htmlFor="old_password_field"
              className="block text-gray-700 mb-2 font-medium"
            >
              Old Password
            </label>
            <input
              type="password"
              id="old_password_field"
              name="oldPassword"
              value={oldPassword}
              onChange={(e)=>setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label
              htmlFor="new_password_field"
              className="block text-gray-700 mb-2 font-medium"
            >
              New Password
            </label>
            <input
              type="password"
              id="new_password_field"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn form-btn w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
