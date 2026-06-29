import AdminGuard from "@/components/auth/AdminGuard";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <Link href="/admin/rooms" className="hover:text-red-400 transition">🛏 Rooms</Link>
          <Link href="/admin/bookings" className="hover:text-red-400 transition">📋 Bookings</Link>
          <Link href="/admin/users" className="hover:text-red-400 transition">👥 Users</Link>
        </aside>
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </AdminGuard>
  );
}