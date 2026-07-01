"use client";

import {
  useAdminGetUsersQuery,
  useAdminDeleteUserMutation,
  useAdminUpdateUserRoleMutation,
} from "@/redux/api/adminApi";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";
import ConfirmModal from "@/components/layout/ConfirmModal";
import { useAppSelector } from "@/redux/hooks";
import { signOut } from "next-auth/react";

const AdminUsersList = () => {
  const { data, isLoading } = useAdminGetUsersQuery(undefined);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [deleteUser] = useAdminDeleteUserMutation();
  const [updateRole] = useAdminUpdateUserRoleMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteInfo, setDeleteInfo] = useState<{ id: string; name: string } | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteInfo) return;
    const res = await deleteUser(deleteInfo.id);
    if ("data" in res) toast.success("User deleted");
    else toast.error("Failed to delete user");
    setDeleteInfo(null);
  };

  const handleRoleChange = async (id: string, role: string) => {
    const res = await updateRole({ id, role });
    if ("data" in res) {
      toast.success(`Role updated to ${role}`);
      setEditingId(null);
      if (id === currentUser?._id && role === "user") {
        signOut({ callbackUrl: "/" });
      }
    } else {
      toast.error("Failed to update role");
    }
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

  const users: any[] = data?.users ?? [];
  const adminCount = users.filter((u) => u.role === "admin").length;
  const regularCount = users.filter((u) => u.role !== "admin").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", value: users.length, color: "bg-rose-50 text-rose-700" },
          { label: "Admins", value: adminCount, color: "bg-gray-800 text-white" },
          { label: "Regular Users", value: regularCount, color: "bg-gray-50 text-gray-700" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th key={h} className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                          <Image
                            src={user.avatar?.url || "/images/default_avatar.jpg"}
                            alt={user.name}
                            width={36}
                            height={36}
                            className="object-cover w-9 h-9"
                          />
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>

                    <td className="p-3 text-gray-600">{user.email}</td>

                    <td className="p-3">
                      {editingId === user._id ? (
                        <div className="flex items-center gap-1">
                          <select
                            defaultValue={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs text-gray-400 hover:text-gray-600 px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(user._id)}
                          title="Click to change role"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-opacity hover:opacity-75 ${
                            user.role === "admin"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role}
                          <span className="ml-0.5 text-[10px] opacity-60">▾</span>
                        </button>
                      )}
                    </td>

                    <td className="p-3 text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => setDeleteInfo({ id: user._id, name: user.name })}
                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-medium transition"
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
        isOpen={!!deleteInfo}
        onClose={() => setDeleteInfo(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteInfo?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminUsersList;