import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../app/store/store";
import { useProfileQuery } from "../app/api/AuthApi";
import { setCredentials, logout } from "../app/slices/AuthSlice";
import React from "react";
import type { User } from "../types/user";

export default function RequireAuth() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;
  const { data, isLoading, isError } = useProfileQuery(undefined);

  React.useEffect(() => {
    if (!isLoading) {
      if (data && data.user) {
        dispatch(setCredentials({ user: data.user, token: null }));
      } else if (isError) {
        dispatch(logout());
      }
    }
  }, [data, isError, isLoading, dispatch]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <span>Loading...</span>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/not-authorized" replace />;
  }
  return <Outlet />;
}
