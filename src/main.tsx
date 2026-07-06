import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ActivationPage } from "./pages/ActivationPage";
import { BillingPage } from "./pages/BillingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { HealthMetricsPage } from "./pages/HealthMetricsPage";
import { LoginPage } from "./pages/LoginPage";
import "./styles.css";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/employees", element: <EmployeesPage /> },
      { path: "/activation", element: <ActivationPage /> },
      { path: "/health-metrics", element: <HealthMetricsPage /> },
      { path: "/billing", element: <BillingPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
