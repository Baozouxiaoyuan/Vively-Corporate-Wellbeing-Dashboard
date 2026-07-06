import { Bell, Search } from "lucide-react";
import { corporateAccountMock } from "../../data/employees.mock";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-ink/10 bg-mist px-3 py-2 text-sm text-ink/55 lg:max-w-md">
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Search employees or teams</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="grid h-9 w-9 place-items-center rounded-md border border-ink/10 bg-white text-ink/70 hover:bg-mist" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-semibold">{corporateAccountMock.admin_name}</div>
            <div className="text-xs text-ink/55">{corporateAccountMock.company_name}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
