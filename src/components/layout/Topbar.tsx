import { Bell } from "lucide-react";
import { corporateAccountMock } from "../../data/employees.mock";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-ink">Corporate admin</div>
          <div className="text-xs text-ink/55">Prototype workspace</div>
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
