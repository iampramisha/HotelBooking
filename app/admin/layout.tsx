"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BedDouble, Calendar, Users, ArrowLeft } from "lucide-react";

const navItems = [
  { href: "/admin/rooms", label: "Rooms", icon: <BedDouble size={18} /> },
  { href: "/admin/bookings", label: "All Reservations", icon: <Calendar size={18} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* ── Sidebar ── */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          {/* Brand */}
          <div className="px-6 py-6 border-b border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Admin
            </span>
            <p className="text-white font-bold text-xl mt-1">BookIT</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-rose-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-gray-700 my-4" />

            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              Book your room
            </Link>
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}