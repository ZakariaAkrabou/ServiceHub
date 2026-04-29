import { api } from "./Config";

export interface Booking {
  _id: string;
  status: string;
  customer_id: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  service_id: {
    _id: string;
    provider_id: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookingListResponse {
  result: number;
  totalBookings: number;
  totalPages: number;
  currentPage: number;
  data: Booking[];
}

export interface BookingDetailResponse {
  message: string;
  data: Booking;
}

export const bookingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query<
      BookingListResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/api/admin/bookings",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Booking" as const,
                id: String(_id),
              })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),
    getBookingById: builder.query<BookingDetailResponse, string>({
      query: (id) => ({
        url: `/api/admin/bookings/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Booking", id: String(id) }],
    }),
    filterBookings: builder.query<
      BookingListResponse,
      {
        status?: string;
        customerId?: string;
        providerId?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/api/admin/bookings/filter",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Booking" as const,
                id: String(_id),
              })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),
    updateBookingStatus: builder.mutation<
      { message: string; data: Booking },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/api/services/bookings/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Booking", id: String(id) },
        { type: "Booking", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useFilterBookingsQuery,
  useUpdateBookingStatusMutation,
} = bookingApi;
