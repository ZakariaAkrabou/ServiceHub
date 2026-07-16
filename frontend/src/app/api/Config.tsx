/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery, type BaseQueryFn,type  FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { isUserActive } from "../../utils/activityTracker";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any)?.auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (isUserActive()) {
      
      const refreshResult = await baseQuery(
        { url: "/api/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as any;
        if (data.accessToken) {
          const state = api.getState() as any;
          api.dispatch({ type: "auth/setCredentials", payload: { token: data.accessToken, user: state.auth.user } });
         
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch({ type: "auth/logout" });
        }
      } else {
        api.dispatch({ type: "auth/logout" });
      }
    } else {
     
      api.dispatch({ type: "auth/logout" });
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Booking", "Auth", "User", "Service", "Notification", "ChatUnreadCount"],
  endpoints: () => ({}),
});

export default api;
