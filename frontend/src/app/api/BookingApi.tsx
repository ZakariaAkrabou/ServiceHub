import { api } from "./Config";

export interface Booking {
  _id: string;
  status: string;
  chosenContactMethod?: string;
  booking_time?: string;
  customer_id: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  service_id: {
    _id: string;
    name?: string;
    price?: number;
    category?: string;
    image?: string;
    provider_id?: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  lastChatMessage?: ChatMessage | null;
  unreadChatCount?: number;
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

export interface ChatMessage {
  _id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessagesResponse {
  success: boolean;
  chat: ChatMessage[];
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
      providesTags: (_result, _error, id) => [
        { type: "Booking", id: String(id) },
      ],
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Booking", id: String(id) },
        { type: "Booking", id: "LIST" },
      ],
    }),
    getProviderBookings: builder.query<
      { success: boolean; count: number; data: Booking[] },
      void
    >({
      query: () => ({
        url: "/api/services/my-bookings",
        method: "GET",
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

    // Customer: create a booking
    createCustomerBooking: builder.mutation<
      { success: boolean; message: string; data: Booking },
      { service_id: string; booking_time: string }
    >({
      query: (body) => ({
        url: "/api/customer/create-bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),

    getCustomerBookings: builder.query<
      { success: boolean; count: number; data: Booking[] },
      void
    >({
      query: () => ({
        url: "/api/customer/all-bookings",
        method: "GET",
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

    setContactMethod: builder.mutation<
      { success: boolean; message: string; data: Booking; providerEmail?: string },
      { id: string; method: "email" | "chat" }
    >({
      query: ({ id, method }) => ({
        url: `/api/customer/bookings/${id}/contact-method`,
        method: "PATCH",
        body: { method },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Booking", id: String(id) },
        { type: "Booking", id: "LIST" },
      ],
    }),

    getChatMessages: builder.query<ChatMessagesResponse, string>({
      query: (bookingId) => ({
        url: `/api/chat/${bookingId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Booking", id: `CHAT_${id}` }],
    }),
    getUnreadChatCount: builder.query<{ success: boolean; count: number }, void>({
      query: () => ({
        url: "/api/chat/unread-count",
        method: "GET",
      }),
      providesTags: ["ChatUnreadCount"],
    }),
    markChatMessagesAsRead: builder.mutation<{ success: boolean }, string>({
      query: (bookingId) => ({
        url: `/api/chat/${bookingId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, bookingId) => [
        "ChatUnreadCount",
        { type: "Booking", id: String(bookingId) },
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
  useGetProviderBookingsQuery,
  useCreateCustomerBookingMutation,
  useGetCustomerBookingsQuery,
  useSetContactMethodMutation,
  useGetChatMessagesQuery,
  useGetUnreadChatCountQuery,
  useMarkChatMessagesAsReadMutation,
} = bookingApi;
