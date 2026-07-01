"use client";

import { useAdminGetBookingsQuery, useAdminDeleteBookingMutation } from "@/redux/api/adminApi";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/layout/ConfirmModal";
import { useState } from "react";

const AdminBookingsList = () => {
  const { data, isLoading } = useAdminGetBookingsQuery(undefined);
  const [deleteBooking, { isLoading: deleting }] = useAdminDeleteBookingMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const res = await deleteBooking(deleteId);
    if ("data" in res) toast.success("Reservation deleted");
    else toast.error("Failed to delete reservation");
    setDeleteId(null);
  };

  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const statusColor = (status: string) => {
    if (status === "succeeded" || status === "paid") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-gray-100" />
        ))}
      </div>
    );
  }

  const bookings: any[] = data?.bookings ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Reservations</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {bookings.length} reservation{bookings.length !== 1 ? "s" : ""} in total
          </p>
        </div>

        <div className="bg-rose-600 text-white rounded-xl px-5 py-3">
          <p className="text-xs font-medium opacity-80">Total Revenue</p>
          <p className="text-2xl font-bold">
            Rs. {(data?.totalAmount ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Bookings", value: bookings.length, color: "bg-rose-50 text-rose-700" },
          { label: "Confirmed", value: bookings.filter((b) => b.paymentInfo?.status === "succeeded" || b.paymentInfo?.status === "paid").length, color: "bg-green-50 text-green-700" },
          { label: "Pending", value: bookings.filter((b) => b.paymentInfo?.status === "pending").length, color: "bg-yellow-50 text-yellow-700" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No reservations yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Booking ID", "Guest", "Room", "Check-In", "Check-Out", "Days", "Amount", "Status", "Actions"].map((h) => (
                    <th key={h} className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking: any) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-xs text-gray-400 font-mono max-w-[100px] truncate">
                      {String(booking._id).slice(-8)}...
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {booking.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400">{booking.user?.email || ""}</p>
                      </div>
                    </td>
                    <td className="p-3 text-gray-700 font-medium max-w-[120px] truncate">
                      {booking.room?.name || "—"}
                    </td>
                    <td className="p-3 text-gray-600">{formatDate(booking.checkInDate)}</td>
                    <td className="p-3 text-gray-600">{formatDate(booking.checkOutDate)}</td>
                    <td className="p-3 text-gray-600 text-center">{booking.daysOfStay}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      Rs. {booking.amountPaid?.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(
                          booking.paymentInfo?.status || ""
                        )}`}
                      >
                        {booking.paymentInfo?.status || "unknown"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setDeleteId(booking._id)}
                        disabled={deleting}
                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-medium transition disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Reservation"
        message="Are you sure you want to delete this reservation? This action cannot be undone."
      />
    </div>
  );
};

export default AdminBookingsList;