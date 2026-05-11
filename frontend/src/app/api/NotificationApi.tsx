import { api } from "./Config";

export const NotificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query({
      query: () => "/api/admin/notifications",
      providesTags: ["Notification"],
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/admin/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: "/api/admin/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    getUnreadNotificationCount: builder.query({
      query: () => "/api/admin/notifications/unread-count",
      providesTags: ["Notification"],
    }),
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
});

export const {
  useGetAdminNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useGetUnreadNotificationCountQuery,
} = NotificationApi;
