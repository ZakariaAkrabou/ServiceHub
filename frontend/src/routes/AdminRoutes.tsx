import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/admin/auth/login";
import Dashboard from "../pages/admin/Dashboard/Dashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
}
