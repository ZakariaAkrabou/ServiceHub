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

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<ClientServices />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/bookings" element={<ClientBookings />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:bookingId" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/provider/bookings" element={<ProviderBookings />} />
      <Route path="/provider/services" element={<ProviderServices />} />
      <Route path="/provider/settings" element={<ProviderSettings />} />
      <Route path="/provider/contact" element={<ProviderContact />} />
      <Route path="/provider/contact/:bookingId" element={<ProviderContact />} />
      <Route
        path="/provider/notifications"
        element={<ProviderNotifications />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
