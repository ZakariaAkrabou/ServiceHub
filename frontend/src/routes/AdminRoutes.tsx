import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/admin/auth/login";
import ForgotPassword from "../pages/admin/auth/forgot-password";
import ResetPassword from "../pages/admin/auth/reset-password";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import ProvidersManagement from "../pages/admin/Providers/ProvidersManagment";
import AdminLayouts from "../layouts/AdminLayouts";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<AdminLayouts />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/providers" element={<ProvidersManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}