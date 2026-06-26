import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePoll from "./pages/CreatePoll";
import Poll from "./pages/Poll";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AuthGuard from "./components/AuthGuard";
import "./index.css";
import GoogleCalendarCallback from './pages/GoogleCalendarCallback'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poll/:id" element={<Poll />} />
        <Route path="/calendar/google/callback" element={<GoogleCalendarCallback />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
