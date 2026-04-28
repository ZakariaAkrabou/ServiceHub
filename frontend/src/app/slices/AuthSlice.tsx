import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/AuthApi";
import type { RootState } from "../store/store";

import type { User } from "../../types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = payload.token;
          state.user = payload.user || null;
        },
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error =
            typeof payload === "object" &&
            payload &&
            "data" in payload &&
            typeof payload.data === "string"
              ? payload.data
              : "Login failed";
        },
      )
      // Register
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        authApi.endpoints.register.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error =
            typeof payload === "object" &&
            payload &&
            "data" in payload &&
            typeof payload.data === "string"
              ? payload.data
              : "Registration failed";
        },
      )
      // Forgot Password
      .addMatcher(authApi.endpoints.forgotPassword.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.forgotPassword.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        authApi.endpoints.forgotPassword.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error =
            typeof payload === "object" &&
            payload &&
            "data" in payload &&
            typeof payload.data === "string"
              ? payload.data
              : "Forgot password failed";
        },
      )
      // Reset Password
      .addMatcher(authApi.endpoints.resetPassword.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.resetPassword.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        authApi.endpoints.resetPassword.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error =
            typeof payload === "object" &&
            payload &&
            "data" in payload &&
            typeof payload.data === "string"
              ? payload.data
              : "Reset password failed";
        },
      )
      // Refresh Token
      .addMatcher(
        authApi.endpoints.refreshToken.matchFulfilled,
        (state, { payload }) => {
          if (payload?.accessToken) {
            state.token = payload.accessToken;
            state.isAuthenticated = true;
          }
        },
      );
  },
});

export const { setCredentials, logout, setError, clearError } =
  authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;

export default authSlice.reducer;
