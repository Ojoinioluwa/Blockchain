import { createBrowserRouter, Navigate } from "react-router-dom";
// import Home from "../pages/home";
import DashboardLayout from "../Layouts/DashboardLayout";
import SentinelOverview from "../pages/Overview";
import Onboarding from "../pages/Onboarding";
import Transfer from "../pages/Transfer";
import Audit from "../pages/Audit";
import ErrorPage from "../pages/ErrorPage";
import BlacklistPage from "../pages/Blacklist";
import SanctionsPage from "../pages/SanctionPage";

export const router = createBrowserRouter([
  {
    path: "/",
    // Adding the errorElement here catches everything
    // from 404s to actual code crashes.
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },

      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <SentinelOverview /> },
          { path: "onboarding", element: <Onboarding /> },
          { path: "transfer", element: <Transfer /> },
          { path: "audit", element: <Audit /> },
          { path: "blacklist", element: <BlacklistPage /> },
          { path: "sanctioned", element: <SanctionsPage /> },
        ],
      },
    ],
  },
]);
