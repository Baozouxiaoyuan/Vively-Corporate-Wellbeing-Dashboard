import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-mist text-ink">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
