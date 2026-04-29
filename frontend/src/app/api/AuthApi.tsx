import { api } from "./Config";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", { type: "User", id: "LIST" }],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/api/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth", { type: "User", id: "LIST" }],
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/api/auth/reset-password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    profile: builder.query({
      query: () => ({
        url: "/api/user/profile",
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Auth", id: result._id }, "Auth"] : ["Auth"],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/api/auth/refresh-token",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useProfileQuery,
  useRefreshTokenMutation,
} = authApi;
