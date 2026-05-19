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
import NotFound from "../pages/client/errors/NotFound";
import About from "../pages/client/about/about";
import Services from "../pages/client/services/Services";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/provider/bookings" element={<ProviderBookings />} />
      <Route path="/provider/services" element={<ProviderServices />} />
      <Route path="/provider/settings" element={<ProviderSettings />} />
      <Route path="/provider/notifications" element={<ProviderNotifications />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
