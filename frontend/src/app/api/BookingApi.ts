// frontend/src/app/api/BookingApi.ts
import { api } from "./Config";

export const bookingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: (params) => ({
        url: "/api/admin/bookings/filter", // Route correcte selon admin.route.js
        method: "GET",
        params: params,
      }),
      providesTags: ["Bookings"], // Permet de rafraîchir si on modifie une réservation
    }),
  }),
});

export const { useGetBookingsQuery } = bookingApi;