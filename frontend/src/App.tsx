import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminRoutes from "./routes/AdminRoutes";
import ClientRoutes from "./routes/ClientRoutes";

import { useAuthBootstrap } from "./app/slices/useAuthBootstrap";
import { useState, useCallback, useEffect } from "react";
import { BootContext } from "./app/BootContext";
import { setupActivityTracker } from "./utils/activityTracker";

function App() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const handleBootstrapDone = useCallback(() => setBootstrapping(false), []);
  useAuthBootstrap(handleBootstrapDone);

  useEffect(() => {
    const cleanup = setupActivityTracker();
    return cleanup;
  }, []);

  return (
    <BootContext.Provider value={bootstrapping}>
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
    </BootContext.Provider>
  );
}

export default App;
