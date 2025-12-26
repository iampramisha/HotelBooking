
import UserSidebar from "@/components/layout/userSidebar";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const UserLayout = ({ children }: Props) => {
  return (
   <>
      {/* Header */}
      <div className=" mb-4 bg-gray-100 py-4">
        <h2 className="text-gray-600 text-center font-semibold text-lg">
          User Settings
        </h2>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <UserSidebar />
          </div>

          {/* Dashboard content */}
          <div className="lg:col-span-9 bg-white  px-2 mt-6 ">
            {children}
          </div>
        </div>
      </div>
 </>
  );
};

export default UserLayout;
