import { Activity, CreditCard, Plus, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { VivelyLogo } from "../vively-ui/Logo";

const navItems = [
  { label: "Team health", href: "/health-metrics", icon: Activity },
  { label: "People", href: "/employees", icon: Users },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-ink/10 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-ink/10 px-6">
          <div className="flex items-center gap-3">
            <VivelyLogo className="h-8 w-9 text-neutral-900" />
            <div>
              <div className="text-lg font-semibold tracking-normal">Vively</div>
              <div className="text-xs uppercase tracking-[0.18em] text-sage">For teams</div>
            </div>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          <NavLink
            to="/employees?invite=1"
            className="mb-4 flex items-center gap-3 rounded-md border border-ink/10 bg-mist px-3 py-2.5 text-sm font-semibold text-ink/75 transition hover:border-ink/15 hover:text-ink"
          >
            <Plus className="h-4 w-4" />
            Invite employees
          </NavLink>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                    isActive ? "bg-mist text-ink" : "text-ink/60 hover:bg-mist/70 hover:text-ink",
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
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-ink/10 bg-white px-1 py-2 shadow-soft lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                [
                  "flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-1.5 text-[11px] font-medium transition",
                  isActive ? "bg-mist text-ink" : "text-ink/65 hover:bg-mist/70 hover:text-ink",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="w-full truncate text-center">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
