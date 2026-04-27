import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../app/store/store";
import { useProfileQuery } from "../app/api/AuthApi";
import { setCredentials, logout } from "../app/slices/AuthSlice";
import React from "react";
import type { User } from "../types/user";
interface RequireAuthProps {
  allowedRoles?: string[];
}

export default function RequireAuth({
  allowedRoles = ["admin"],
}: RequireAuthProps) {
  const dispatch = useDispatch();

  const { isAuthenticated, user, token } = useSelector(
    (state: RootState) => state.auth,
  ) as { isAuthenticated: boolean; user: User | null; token: string | null };

  const { data, isLoading, isError, error } = useProfileQuery(undefined, {
    skip: !token || !!user,
  });

  React.useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials({ user: data.user, token }));
    }

    if (isError && (error as any)?.status === 401) {
      dispatch(logout());
    }
  }, [data, isError, error, dispatch, token]);

  if (isLoading && !user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 font-sans">
        <div className="relative flex items-center justify-center">
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "3px solid rgba(8, 29, 58, 0.05)",
              borderTopColor: "#F6E304",
              animation: "spin 1s linear infinite",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "30px",
              height: "30px",
              backgroundColor: "#081D3A",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#F6E304"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <span
          style={{
            marginTop: "24px",
            color: "#081D3A",
            fontSize: "14px",
            fontWeight: "500",
            letterSpacing: "0.02em",
            opacity: 0.8,
          }}
        >
          Verifying session...
        </span>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F3F3F3",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "2px solid rgba(8, 29, 58, 0.1)",
            borderTopColor: "#081D3A",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/not-authorized" replace />;
  }

  return <Outlet />;
}
