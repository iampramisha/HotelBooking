import { updatePassword, updateProfile, uploadAvatar } from '@/backend/controllers/authControllers';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const bookingApi=createApi({
    reducerPath:'bookingApi',
    baseQuery:fetchBaseQuery({baseUrl:'/api'}),
    endpoints:(builder)=>({
        newBooking:builder.mutation({
        query(body){
            return{
                url:'/bookings',
                method:'POST',
                body
            }
        }
        
    }),
     checkBookingAvailability:builder.query({
        query({id,checkInDate,checkOutDate}){
            return{
                url:`/bookings/check_room_availability?roomId=${id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
            method:'GET'
            }
        }
        
    }),
       getBookedDates:builder.query({
        query({roomId}){
            return{
                url:`/bookings/booked_dates?roomId=${roomId}`,
            method:'GET'
            }
        }
        
    }),
getBookingDetails: builder.query({
  query: (bookingId: string) => ({
    url: `/bookings/${bookingId}`, // ✅ dynamic route
    method: "GET",
  }),
}),


})
})
export const {useNewBookingMutation, useLazyCheckBookingAvailabilityQuery,useGetBookedDatesQuery,useGetBookingDetailsQuery} = bookingApi;