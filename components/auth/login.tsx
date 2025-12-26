"use client"
import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ClipLoader from "react-spinners/ClipLoader";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [loading,setLoading]=useState(false);
    const router=useRouter();
    const submitHandler=async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true)
        const result=await signIn('credentials',{
            redirect:false,
            email,
            password
        });
        setLoading(false);
        if(result?.error){
            toast.error(result.error)
        }else{
            router.replace('/')
        }
    }
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-11/12 md:w-2/5">
        <form
          className="bg-white shadow-lg rounded-lg p-8"
          action="#"
          method="POST"
          onSubmit={submitHandler}
        >
          <h1 className="text-2xl font-semibold mb-6">Login</h1>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email_field"
            >
              Email
            </label>
            <input
              type="email"
              id="email_field"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="example@example.com"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password_field"
            >
              Password
            </label>
            <input
              type="password"
              id="password_field"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="**********"
              value={password}
                 onChange={(e)=> setPassword(e.target.value)}
            />
          </div>

          <a
            href="/password/forgot"
            className="block text-right text-blue-600 text-sm hover:underline mb-4"
          >
            Forgot Password?
          </a>

          <button
            id="login_button"
            type="submit"
       disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
          >
  {loading ? <ClipLoader size={20} color="#fff" /> : "LOGIN"}
          </button>

          <div className="mt-4">
            <a
              href="/register"
              className="block text-right text-blue-600 text-sm hover:underline"
            >
              New User? Register Here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
