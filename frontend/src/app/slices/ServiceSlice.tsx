import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Service } from "../api/ServiceApi";

interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices(state, action: PayloadAction<Service[]>) {
      state.services = action.payload;
    },
    addService(state, action: PayloadAction<Service>) {
      state.services.unshift(action.payload);
    },
    removeService(state, action: PayloadAction<string>) {
      state.services = state.services.filter((s) => s._id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setServices, addService, removeService, setLoading, setError } =
  serviceSlice.actions;
export default serviceSlice.reducer;
