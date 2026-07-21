import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { BillingPage } from "./pages/BillingPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { HealthMetricsPage } from "./pages/HealthMetricsPage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import "./styles.css";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/health-metrics" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/employees", element: <EmployeesPage /> },
      { path: "/activation", element: <Navigate to="/employees" replace /> },
      { path: "/health-metrics", element: <HealthMetricsPage /> },
      { path: "/billing", element: <BillingPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
