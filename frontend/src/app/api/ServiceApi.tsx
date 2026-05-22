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

export interface CustomerService {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
  availability?: string[];
  provider_id?:
    | string
    | {
        _id?: string;
        firstName?: string;
        lastName?: string;
        name?: string;
        email?: string;
      };
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerServiceReview {
  _id: string;
  booking_id: string;
  customer_id:
    | string
    | {
        _id?: string;
        firstName?: string;
        lastName?: string;
      };
  service_id: string;
  rating: number;
  review: string;
  createdAt?: string;
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
    getProviderServices: builder.query<
      { success: boolean; data: Service[] },
      void
    >({
      query: () => ({
        url: "/api/services/my-services",
        method: "GET",
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
      providesTags: (_result, _error, id) => [
        { type: "Service", id: String(id) },
      ],
    }),
    getCustomerAllServices: builder.query<
      {
        data: CustomerService[];
        meta: { total: number; page: number; limit: number; pages: number };
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 50 } = {}) => ({
        url: "/api/customer/services",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any) => ({
        data: response?.data || [],
        meta: response?.meta || { total: 0, page: 1, limit: 50, pages: 0 },
      }),
      providesTags: [{ type: "Service", id: "LIST" }],
    }),
    searchCustomerServices: builder.query<
      { data: CustomerService[]; count: number },
      { keyword: string }
    >({
      query: ({ keyword }) => ({
        url: "/api/customer/search-services",
        method: "GET",
        params: { keyword },
      }),
      transformResponse: (response: any) => ({
        data: response?.data || [],
        count: response?.count || 0,
      }),
      providesTags: [{ type: "Service", id: "LIST" }],
    }),
    filterCustomerServices: builder.query<
      { data: CustomerService[]; results: number },
      {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        rating?: number;
        availability?: string;
        location?: string;
      }
    >({
      query: (params) => ({
        url: "/api/customer/filter-services",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => ({
        data: response?.data || [],
        results: response?.results || 0,
      }),
      providesTags: [{ type: "Service", id: "LIST" }],
    }),
    getCustomerServiceById: builder.query<CustomerService, string>({
      query: (id) => ({
        url: `/api/customer/services/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
      providesTags: (_result, _error, id) => [
        { type: "Service", id: String(id) },
      ],
    }),
    getCustomerServiceReviews: builder.query<
      { data: CustomerServiceReview[]; count: number; averageRating: number },
      string
    >({
      query: (serviceId) => ({
        url: `/api/customer/reviews/${serviceId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => ({
        data: response?.data || [],
        count: response?.count || 0,
        averageRating: response?.averageRating || 0,
      }),
      providesTags: (_result, _error, serviceId) => [
        { type: "Service", id: `REVIEWS-${String(serviceId)}` },
      ],
    }),
    createService: builder.mutation<Service, FormData>({
      query: (newService) => ({
        url: "/api/services/create",
        method: "POST",
        body: newService,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
    updateService: builder.mutation<
      Service,
      { id: string; data: FormData | Partial<Service> }
    >({
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
  useGetProviderServicesQuery,
  useGetServiceByIdQuery,
  useGetCustomerAllServicesQuery,
  useSearchCustomerServicesQuery,
  useFilterCustomerServicesQuery,
  useGetCustomerServiceByIdQuery,
  useGetCustomerServiceReviewsQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;

export default serviceApi;
