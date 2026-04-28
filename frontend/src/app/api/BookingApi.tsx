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
      providesTags: ["Bookings"],
    }),
    getBookingById: builder.query<BookingDetailResponse, string>({
      query: (id) => ({
        url: `/api/admin/bookings/${id}`,
        method: "GET",
      }),
      providesTags: ["Bookings"],
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
      providesTags: ["Bookings"],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useFilterBookingsQuery,
} = bookingApi;
