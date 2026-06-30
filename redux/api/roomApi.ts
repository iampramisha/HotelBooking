import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['AdminRooms'],
  endpoints: (builder) => ({
adminGetRooms: builder.query({
  query: (page = 1) => `/admin/rooms?page=${page}`,
  providesTags: ['AdminRooms'],
}),
    adminCreateRoom: builder.mutation({
      query(body) {
        return { url: '/admin/rooms', method: 'POST', body };
      },
      invalidatesTags: ['AdminRooms'],
    }),
    adminUpdateRoom: builder.mutation({
      query({ id, body }) {
        return { url: `/admin/rooms/${id}`, method: 'PUT', body };
      },
      invalidatesTags: ['AdminRooms'],
    }),
    adminDeleteRoom: builder.mutation({
      query(id: string) {
        return { url: `/admin/rooms/${id}`, method: 'DELETE' };
      },
      invalidatesTags: ['AdminRooms'],
    }),
    getRoomDetails: builder.query({
      query: (id: string) => `/rooms/${id}`,
    }),
    createReview: builder.mutation({
      query: ({ roomId, body }: { roomId: string; body: { rating: number; comment: string } }) => ({
        url: `/rooms/${roomId}/reviews`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useAdminGetRoomsQuery,
  useAdminCreateRoomMutation,
  useAdminUpdateRoomMutation,
  useAdminDeleteRoomMutation,
  useGetRoomDetailsQuery,
  useCreateReviewMutation,
} = roomApi;