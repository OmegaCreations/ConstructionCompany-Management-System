import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Auth from "./pages/Auth/Auth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Routing for application */}
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
