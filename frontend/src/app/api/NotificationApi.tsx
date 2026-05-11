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
  }),
  overrideExisting: true,
});

export const {
  useGetAdminNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useGetUnreadNotificationCountQuery,
} = NotificationApi;
