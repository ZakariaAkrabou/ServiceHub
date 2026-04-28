import { api } from "./Config";

export const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyServices: builder.query<any[], void>({
      query: () => ({ url: "/api/services/my-services", method: "GET" }),
      transformResponse: (response: any) => response?.data ?? [],
      providesTags: ["Services"],
    }),
    getAllServices: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/api/customer/services", method: "GET", params }),
      transformResponse: (response: any) => ({ data: response?.data ?? [], meta: response?.meta ?? {} }),
      providesTags: ["Services"],
    }),
    getServiceById: builder.query<any, string>({
      query: (id) => ({ url: `/api/services/service/${id}`, method: "GET" }),
    }),
    createService: builder.mutation<any, Partial<any>>({
      query: (body) => ({ url: "/api/services/create", method: "POST", body }),
      invalidatesTags: ["Services"],
    }),
    updateService: builder.mutation<any, { id: string; body: Partial<any> }>({
      query: ({ id, body }) => ({ url: `/api/services/update/${id}`, method: "PUT", body }),
      invalidatesTags: ["Services"],
    }),
    deleteService: builder.mutation<any, string>({
      query: (id) => ({ url: `/api/services/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useGetMyServicesQuery,
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;

export default serviceApi;
