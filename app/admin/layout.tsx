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
      <div className="flex min-h-[calc(100vh-80px)] stretch">
        <aside className="w-64 bg-rose-50 border-r border-rose-100 flex flex-col">
          <div className="px-6 py-8 border-b border-rose-200">
            <div className="flex flex-col">
              <span className="text-rose-950 text-2xl font-serif tracking-tight mb-1">


                ADMIN
              </span>
              <span className="text-rose-950 text-2xl font-serif tracking-tight">
                BookIT
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-rose-700 hover:bg-rose-200 hover:text-rose-900"
                    }`}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}

            <div className="border-t border-rose-200 my-4" />

            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-200 hover:text-rose-900 transition-colors"
            >
              <ArrowLeft size={18} />
              Book your room
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </AdminGuard>
  );
}