"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const UserSidebar = () => {
  const pathname = usePathname();

  const menuItem = [
    { name: "Update Profile", url: "/me/update", icon: "fas fa-user" },
    { name: "Upload Avatar", url: "/me/upload_avatar", icon: "fas fa-user-circle" },
    { name: "Update Password", url: "/me/update_password", icon: "fas fa-lock" },
  ];

  return (
    <div className="mt-5 pl-4">
      {menuItem.map((item, index) => {
        const isActive = pathname === item.url;

        return (
          <Link
            key={index}
            href={item.url}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center px-3 py-2 mb-2 rounded font-bold transition
              ${
                isActive
                  ? "bg-gray-100 text-[#e61e4d]"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
          >
            <i className={`${item.icon} fa-fw pe-2`}></i>
            <span className="ml-2">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default UserSidebar;
