import { api } from "./Config";

export interface BanUserPayload {
  userId: string;
  reason: string;
  duration: number | null;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/api/admin/allusers",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    banUser: builder.mutation<any, BanUserPayload>({
      query: ({ userId, reason, duration }) => ({
        url: `/api/admin/users/ban/${userId}`,
        method: "PUT",
        body: { reason, duration },
      }),
      invalidatesTags: ["User"],
    }),
    unbanUser: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({
        url: `/api/admin/users/unban/${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} = userApi;
