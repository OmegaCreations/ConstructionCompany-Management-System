import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Auth from "./pages/Auth/Auth";
import "./style.css";

// Routes
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "react-redux";
import store from "./store/store";
import Dashboard from "./pages/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile/Profile";

// we have html structure for <nav> and <main>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Redux provider */}
    <Provider store={store}>
      {/* Routing for application */}

      <BrowserRouter>
        {/* Navbar for all routes */}
        <Navbar />
        <main>
          <Routes>
            <Route path="/auth" element={<Auth />} />

            {/* Protected route checks if user has allowed role and returns auth component or passed child component */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
