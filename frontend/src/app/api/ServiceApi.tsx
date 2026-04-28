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
      providesTags: ["Services"],
    }),
    getServiceById: builder.query<Service, string>({
      query: (id) => ({
        url: `/api/admin/services/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["Services"],
    }),

  }),
});

export const {
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
} = serviceApi;

export default serviceApi;
