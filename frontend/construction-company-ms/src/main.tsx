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
import Workers from "./pages/Workers/Workers";
import Clients from "./pages/Clients/Clients";
import WarehouseData from "./pages/WarehouseData/WarehouseData";
import Resources from "./pages/Resources/Resources";
import Orders from "./pages/Orders/Orders";
import ClientDetails from "./pages/Clients/Details/ClientDetails";
import OrderDetails from "./pages/Orders/Details/OrderDetails";
import Calendar from "./pages/Calendar/Calendar";
import WarehouseDetails from "./pages/WarehouseData/Details/WarehouseDetails";
import WorkerDashboard from "./pages/WorkerDashboard/WorkerDashboard";
import ClientView from "./pages/ClientView/ClientView.tsx";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";

// we have html structure for <nav> and <main>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Redux provider */}
    <Provider store={store}>
      {/* Routing for application */}

      <BrowserRouter>
        {/* Navbar for all routes */}
        <div className="navContainer">
          <Navbar />
        </div>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/client/public" element={<ClientView />} />

            {/* Protected route checks if user has allowed role and returns auth component or passed child component */}
            <Route element={<ProtectedRoute admin_route={false} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute admin_route={false} />}>
              <Route path="/dashboard/:id" element={<WorkerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute admin_route={false} />}>
              <Route path="/calendar" element={<Calendar />} />
            </Route>

            <Route element={<ProtectedRoute admin_route={true} />}>
              <Route path="/workers" element={<Workers />} />
            </Route>

            <Route element={<ProtectedRoute admin_route={true} />}>
              <Route path="/clients" element={<Clients />} />
            </Route>
            <Route element={<ProtectedRoute admin_route={true} />}>
              <Route path="/clients/details/:id" element={<ClientDetails />} />
            </Route>

            <Route element={<ProtectedRoute admin_route={true} />}>
              <Route path="/orders" element={<Orders />} />
            </Route>
            <Route element={<ProtectedRoute admin_route={true} />}>
              <Route path="/orders/details/:id" element={<OrderDetails />} />
            </Route>

            <Route element={<ProtectedRoute admin_route={true} />}>
              <Route path="/warehouse/items" element={<Resources />} />
            </Route>
            <Route element={<ProtectedRoute admin_route={true} />}>
              <Route path="/warehouse/data" element={<WarehouseData />} />
            </Route>
            <Route element={<ProtectedRoute admin_route={true} />}>
              <Route
                path="/warehouse/data/details/:id"
                element={<WarehouseDetails />}
              />
            </Route>

            <Route element={<ProtectedRoute admin_route={false} />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
