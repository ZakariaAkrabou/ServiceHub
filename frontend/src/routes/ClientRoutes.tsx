import { Routes, Route } from "react-router-dom";
import Home from "../pages/client/home/home";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
