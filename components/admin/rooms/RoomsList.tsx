"use client";
import { useAdminDeleteRoomMutation, useAdminGetRoomsQuery } from "@/redux/api/roomApi";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import CustomPagination from "@/components/layout/CustomPagination";
import { useState } from "react";
import ConfirmModal from "@/components/layout/ConfirmModal";
import Loader from "@/components/layout/loader";

const RoomsList = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useAdminGetRoomsQuery(page);
  const [deleteRoom] = useAdminDeleteRoomMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const res = await deleteRoom(deleteId);
    if ("data" in res) toast.success("Room deleted");
    else toast.error("Failed to delete");
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Rooms ({data?.roomsCount})</h1>
        <Link
          href="/admin/rooms/new"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          + New Room
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price/Night</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.rooms?.map((room: any) => (
              <tr key={room._id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-xs text-gray-500">{room._id}</td>
                <td className="p-3">{room.name}</td>
                <td className="p-3">{room.category}</td>
                <td className="p-3">Rs. {room.pricePerNight}</td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/rooms/${room._id}/edit`}
                    className="px-3 py-1 bg-emerald-700/20 text-emerald-800 font-medium rounded hover:bg-emerald-700/30 transition-colors text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(room._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <CustomPagination
          resPerPage={data?.resPerPage}
          filteredRoomsCount={data?.filteredRoomsCount}
        />
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
      />
    </div>
  );
};

export default RoomsList;