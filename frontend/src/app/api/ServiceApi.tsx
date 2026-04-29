import { api } from "./Config";

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  provider_id: any;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query<
      {
        data: Service[];
        totalServices: number;
        totalPages: number;
        currentPage: number;
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/api/admin/services",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any) => ({
        data: response.data || [],
        totalServices: response.totalServices,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: any) => ({
                type: "Service" as const,
                id: String(_id),
              })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),
    getServiceById: builder.query<Service, string>({
      query: (id) => ({
        url: `/api/admin/services/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Service", id: String(id) }],
    }),
    createService: builder.mutation<Service, Partial<Service>>({
      query: (newService) => ({
        url: "/api/services/create",
        method: "POST",
        body: newService,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
    updateService: builder.mutation<Service, { id: string; data: Partial<Service> }>({
      query: ({ id, data }) => ({
        url: `/api/services/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id: String(id) },
        { type: "Service", id: "LIST" },
      ],
    }),
    deleteService: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/services/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Service", id: String(id) },
        { type: "Service", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;

export default serviceApi;
