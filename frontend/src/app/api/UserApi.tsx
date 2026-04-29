import { api } from "./Config";

export interface BanUserPayload {
  userId: string;
  reason: string;
  duration: number | null;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, any>({
      query: (params) => ({
        url: "/api/admin/allusers",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: any) => ({
                type: "User" as const,
                id: String(_id),
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "User", id: String(userId) },
        { type: "User", id: "LIST" },
        { type: "Service", id: "LIST" },
        { type: "Booking", id: "LIST" },
      ],
    }),
    banUser: builder.mutation<any, BanUserPayload>({
      query: ({ userId, reason, duration }) => ({
        url: `/api/admin/users/ban/${userId}`,
        method: "PUT",
        body: { reason, duration },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: String(userId) },
        { type: "User", id: "LIST" },
        { type: "Service", id: "LIST" },
      ],
    }),
    unbanUser: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({
        url: `/api/admin/users/unban/${userId}`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: String(userId) },
        { type: "User", id: "LIST" },
        { type: "Service", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} = userApi;
