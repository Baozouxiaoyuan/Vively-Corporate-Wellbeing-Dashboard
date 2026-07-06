import { Activity, BarChart3, CreditCard, LayoutDashboard, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Activation", href: "/activation", icon: Activity },
  { label: "Health Metrics", href: "/health-metrics", icon: BarChart3 },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-ink/10 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-ink/10 px-6">
        <div>
          <div className="text-lg font-semibold tracking-normal">Vively</div>
          <div className="text-xs text-ink/55">Corporate wellbeing</div>
        </div>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                  isActive ? "bg-teal text-white" : "text-ink/70 hover:bg-sage/10 hover:text-ink",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
