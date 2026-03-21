import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import DashboardLayout from "../Layouts/DashboardLayout";
import Overview from "../pages/Overview";
import Onboarding from "../pages/Onboarding";
import Transfer from "../pages/Transfer";
import Audit from "../pages/Audit";

export const router = createBrowserRouter([
    { path: "/", element: <Home/> },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { index: true, element: <Overview /> },
            { path: "onboarding", element: <Onboarding /> },
            { path: "transfer", element: <Transfer /> },
            { path: "audit", element: <Audit /> },
        ],
    },
]);