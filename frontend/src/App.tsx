import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminRoutes from "./routes/AdminRoutes";
import ClientRoutes from "./routes/ClientRoutes";

import { useAuthBootstrap } from "./app/slices/useAuthBootstrap";
import { useState, useCallback } from "react";

function App() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const handleBootstrapDone = useCallback(() => setBootstrapping(false), []);
  useAuthBootstrap(handleBootstrapDone);

  if (bootstrapping) {
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
          Loading...
        </span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
