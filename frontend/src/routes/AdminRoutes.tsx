import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/admin/auth/login";
import ForgotPassword from "../pages/admin/auth/forgot-password";
import ResetPassword from "../pages/admin/auth/reset-password";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import ProvidersManagement from "../pages/admin/Providers/ProvidersManagment";
import AdminLayouts from "../layouts/AdminLayouts";
import CustomerManagement from "../pages/admin/Cutomers/CustomerManagment";
import BookingManagement from "../pages/admin/Bookings/BookingManagment";
import ServicesManagement from "../pages/admin/Services/ServicesManagment";
import SetingsManagment from "../pages/admin/Setings/SetingsManagment";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<AdminLayouts />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/providers" element={<ProvidersManagement />} />
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/bookings" element={<BookingManagement />} />
        <Route path="/services" element={<ServicesManagement />} />
        <Route path="/settings" element={<SetingsManagment />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}
