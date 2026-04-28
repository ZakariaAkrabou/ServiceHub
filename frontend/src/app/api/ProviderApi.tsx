import { api } from "./Config";

export interface Provider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  isBanned: boolean;
  banInfo: any;
  serviceCount?: number;
  jobsCompleted?: number;
  rating?: number;
  joinedDate?: string;
  specialty?: string;
  serviceDescription?: string;
}

export const providerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProviders: builder.query<
      {
        data: Provider[];
        totalUsers: number;
        totalPages: number;
        currentPage: number;
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/api/admin/allusers",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any) => ({
        data: (response.data || []).filter(
          (u: any) => u.role === "service_provider",
        ),
        totalUsers: response.totalUsers,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      }),
      providesTags: ["User"],
    }),
    updateProviderStatus: builder.mutation<
      { message: string },
      { userId: string; status: "approved" | "rejected" }
    >({
      query: ({ userId, status }) => ({
        url: `/api/admin/providers/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetAllProvidersQuery, useUpdateProviderStatusMutation } =
  providerApi;
