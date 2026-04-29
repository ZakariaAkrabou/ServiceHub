import { configureStore } from "@reduxjs/toolkit";
import { api } from "../api/Config";
import authReducer from "../slices/AuthSlice";

import bookingReducer from "../slices/BookingSlice";
import serviceReducer from "../slices/ServiceSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    bookings: bookingReducer,
    services: serviceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
