import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Auth from "./pages/Auth/Auth";

// Routes
import ProtectedRoute from "./components/ProtectedRoute";
import WorkerDashboard from "./pages/WorkerDashboard/WorkerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard/ManagerDashboard";
import { Provider } from "react-redux";
import store from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Redux provider */}
    <Provider store={store}>
      {/* Routing for application */}
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />

          {/* Protected route checks if user has allowed role and returns auth component or passed child component */}
          <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
            <Route path="/dashboard" element={<WorkerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
            <Route path="/dashboard" element={<ManagerDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
