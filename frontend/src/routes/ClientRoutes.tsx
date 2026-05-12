import { Routes, Route } from "react-router-dom";
import Home from "../pages/client/home/home";
import Login from "../pages/client/auth/Login";
import Register from "../pages/client/auth/register";
import NotFound from "../pages/client/errors/NotFound";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
