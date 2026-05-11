import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store/store";

import Login from "../pages/admin/auth/login";
import ForgotPassword from "../pages/admin/auth/forgot-password";
import ResetPassword from "../pages/admin/auth/reset-password";

import Dashboard from "../pages/admin/Dashboard/Dashboard";
import ProvidersManagement from "../pages/admin/Providers/ProvidersManagment";
import CustomerManagement from "../pages/admin/Cutomers/CustomerManagment";
import BookingManagement from "../pages/admin/Bookings/BookingManagment";
import ServicesManagement from "../pages/admin/Services/ServicesManagment";
import SettingsManagement from "../pages/admin/Settings/SettingsManagement";
import Notification from "../pages/admin/notification/notification";

import AdminLayouts from "../layouts/AdminLayouts";
import RequireAuth from "./RequireAuth";
import NotAuthorized from "../pages/admin/auth/NotAuthorized";

export default function AdminRoutes() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const isAdmin = user?.role === "admin";

  return (
    <Routes>
   
      <Route
        path="/login"
        element={
          isAuthenticated && isAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

    
      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route element={<AdminLayouts />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/providers" element={<ProvidersManagement />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/services" element={<ServicesManagement />} />
          <Route path="/settings" element={<SettingsManagement />} />
          <Route path="/notifications" element={<Notification />} />
        </Route>
      </Route>

    
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}