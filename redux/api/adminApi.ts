import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["AdminBookings", "AdminUsers"],
  endpoints: (builder) => ({
    // ── Bookings ──
    adminGetBookings: builder.query({
      query: () => "/bookings",
      providesTags: ["AdminBookings"],
    }),
    adminDeleteBooking: builder.mutation({
      query: (id: string) => ({
        url: `/bookings?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminBookings"],
    }),
    // ── Users ──
    adminGetUsers: builder.query({
      query: () => "/users",
      providesTags: ["AdminUsers"],
    }),
    adminDeleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/users?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    adminUpdateUserRole: builder.mutation({
      query: ({ id, role }: { id: string; role: string }) => ({
        url: `/users?id=${id}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    // ── Room Images ──
    adminUploadRoomImages: builder.mutation({
      query: ({ roomId, images }: { roomId: string; images: string[] }) => ({
        url: "/rooms/images",
        method: "POST",
        body: { roomId, images },
      }),
    }),
    adminDeleteRoomImage: builder.mutation({
      query: ({ roomId, public_id }: { roomId: string; public_id: string }) => ({
        url: "/rooms/images",
        method: "DELETE",
        body: { roomId, public_id },
      }),
    }),
  }),
});
export const {
  useAdminGetBookingsQuery,
  useAdminDeleteBookingMutation,
  useAdminGetUsersQuery,
  useAdminDeleteUserMutation,
  useAdminUpdateUserRoleMutation,
  useAdminUploadRoomImagesMutation,
  useAdminDeleteRoomImageMutation,
} = adminApi;