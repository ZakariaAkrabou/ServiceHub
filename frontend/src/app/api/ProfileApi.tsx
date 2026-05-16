import { api } from "./Config";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/api/user/profile",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: "/api/user/update-profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: "/api/user/change-password",
        method: "POST",
        body: passwords,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;
