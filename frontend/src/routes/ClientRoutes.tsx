import { Routes, Route } from "react-router-dom";
import Home from "../pages/client/home/home";
import Login from "../pages/client/auth/login";
import Register from "../pages/client/auth/register";
import ForgetPassword from "../pages/client/auth/forgetPassword";
import ResetPassword from "../pages/client/auth/resetPassword";
import VerifyEmail from "../pages/client/auth/verifyEmail";
import ProviderDashboard from "../pages/provider/dashboard";
import ProviderBookings from "../pages/provider/bookings";
import ProviderServices from "../pages/provider/services";
import ProviderSettings from "../pages/provider/settings";
import ProviderNotifications from "../pages/provider/notifications";
import ProviderContact from "../pages/provider/contact";
import NotFound from "../pages/client/errors/NotFound";
import About from "../pages/client/about/about";
import Contact from "../pages/client/contact/contact";
import ClientServices from "../pages/client/services/services";
import ServiceDetail from "../pages/client/services/serviceDetail";
import Profile from "../pages/client/profile/profile";
import ClientBookings from "../pages/client/booking/clientBookings";
import Chat from "../pages/client/chat/chat";
import ProtectedRoute from "./ProtectedRoute";

export default function ClientRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<ClientServices />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* Protected client routes */}
      <Route path="/profile" element={<ProtectedRoute allowedRoles={["customer"]}><Profile /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute allowedRoles={["customer"]}><ClientBookings /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute allowedRoles={["customer"]}><Chat /></ProtectedRoute>} />
      <Route path="/chat/:bookingId" element={<ProtectedRoute allowedRoles={["customer"]}><Chat /></ProtectedRoute>} />

      {/* Protected provider routes */}
      <Route path="/provider/dashboard" element={<ProtectedRoute allowedRoles={["service_provider"]}><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/provider/bookings" element={<ProtectedRoute allowedRoles={["service_provider"]}><ProviderBookings /></ProtectedRoute>} />
      <Route path="/provider/services" element={<ProtectedRoute allowedRoles={["service_provider"]}><ProviderServices /></ProtectedRoute>} />
      <Route path="/provider/settings" element={<ProtectedRoute allowedRoles={["service_provider"]}><ProviderSettings /></ProtectedRoute>} />
      <Route path="/provider/contact" element={<ProtectedRoute allowedRoles={["service_provider"]}><ProviderContact /></ProtectedRoute>} />
      <Route path="/provider/contact/:bookingId" element={<ProtectedRoute allowedRoles={["service_provider"]}><ProviderContact /></ProtectedRoute>} />
      <Route
        path="/provider/notifications"
        element={<ProtectedRoute allowedRoles={["service_provider"]}><ProviderNotifications /></ProtectedRoute>}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

