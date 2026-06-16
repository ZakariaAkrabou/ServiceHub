import { api } from "./Config";

export const NotificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<any, void>({
      query: () => "/api/admin/notifications",
      providesTags: ["Notification"],
    }),
    markNotificationAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/admin/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsAsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/api/admin/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    getUnreadNotificationCount: builder.query<{ success: boolean; count: number }, void>({
      query: () => "/api/admin/notifications/unread-count",
      providesTags: ["Notification"],
    }),

    // Provider notifications
    getProviderNotifications: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/api/services/notifications",
      providesTags: ["Notification"],
    }),
    markProviderNotificationRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/services/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllProviderNotificationsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/api/services/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Customer notifications
    getCustomerNotifications: builder.query<{ success: boolean; count: number, data: any[] }, void>({
      query: () => "/api/customer/notifications",
      providesTags: ["Notification"],
    }),
    markCustomerNotificationRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/customer/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllCustomerNotificationsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/api/customer/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useGetUnreadNotificationCountQuery,
  useGetProviderNotificationsQuery,
  useMarkProviderNotificationReadMutation,
  useMarkAllProviderNotificationsReadMutation,
  useGetCustomerNotificationsQuery,
  useMarkCustomerNotificationReadMutation,
  useMarkAllCustomerNotificationsReadMutation,
} = NotificationApi;
