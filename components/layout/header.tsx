"use client";
import { setIsAuthenticated, setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
const Header = () => {
  const { data } = useSession();
  const dispatch=useAppDispatch();
  const {user}=useAppSelector((state)=>state.auth)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeout = useRef<any>(null);
  useEffect(()=>{
    if(data){
      dispatch(setUser(data?.user))
      dispatch(setIsAuthenticated(true))
    }
  },[data])
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  const openNow = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setDropdownOpen(true);
  };
  const closeWithDelay = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
      hoverTimeout.current = null;
    }, 150);
  };
  return (
    <nav className="sticky top-0 py-2 bg-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-1/2 lg:w-1/4">
          <Link href="/" className="inline-block">
            <img className="cursor-pointer h-10" src="/images/bookit_logo.png" alt="BookIT" />
          </Link>
        </div>
        <div className="w-1/2 lg:w-1/4 flex items-center justify-end space-x-4">
          {data === undefined ? (
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          ) : data === null ? (
            <Link
              href="/login"
              className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition flex items-center justify-center"
            >
              Login
            </Link>
          ) : (
            <div
              ref={wrapperRef}
              className="relative inline-block text-left"
              onMouseEnter={openNow}
              onMouseLeave={closeWithDelay}
            >
              <button
                onClick={() => setDropdownOpen((s) => !s)}
                className="flex items-center space-x-2 px-3 py-2 bg-transparent hover:bg-gray-100 rounded-lg transition"
                type="button"
              >
                <figure className="w-12 h-12">
               <img
  src={user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"}
  alt={user?.name || "User"}
  className="rounded-full object-cover w-12 h-12"
/>
                </figure>
                <span className="font-medium">{user?.name}</span>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {user?.role === "admin" && (
                    <Link href="/admin/rooms" className="block px-4 py-2 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/bookings/me" className="block px-4 py-2 hover:bg-gray-100">
                    My Bookings
                  </Link>
                  <Link href="/me/update" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Header;