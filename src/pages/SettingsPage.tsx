import { Building2, Check, ShieldCheck, Trash2, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCorporateAccount } from "../api";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/vively-ui/Button";
import { CorporateAccount } from "../types/corporate";
import { formatCurrency } from "../utils/format";

const admins = [
  { initials: "RY", name: "Ruitao Yuan", email: "ryua7873@uni.sydney.edu.au", role: "Owner" },
  { initials: "SO", name: "Sam Okafor", email: "sam.okafor@northstar.example", role: "Admin" },
];

export function SettingsPage() {
  const [account, setAccount] = useState<CorporateAccount | null>(null);

  useEffect(() => {
    void getCorporateAccount().then(setAccount);
  }, []);

  if (!account) return null;

  return (
    <>
      <PageHeader title="Settings" description="Company account details, admin access and privacy rules for the prototype." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-teal" />
            <h2 className="text-base font-semibold text-ink">Company profile</h2>
          </div>
          <SettingsField label="Company name" value={account.company_name} />
          <SettingsField label="Primary contact" value={`${account.admin_name}, ${account.admin_email}`} />
          <SettingsField label="Invite code" value={account.invite_code} />
          <SettingsField label="Plan price" value={`${formatCurrency(account.plan_price_cents)} per activated employee per year`} />
        </section>
        <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-ink">Admins</h2>
            <Button type="button" variant="secondary" size="s">
              <UserPlus className="h-3.5 w-3.5" />
              Add admin
            </Button>
          </div>
          <div className="space-y-4">
            {admins.map((admin) => (
              <div key={admin.email} className="flex items-center gap-3 border-b border-ink/10 pb-4 last:border-0 last:pb-0">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-dark-green-900 text-sm font-semibold text-white">{admin.initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{admin.name}</p>
                  <p className="truncate text-xs text-ink/50">{admin.email}</p>
                </div>
                <span className="text-xs font-semibold text-ink/50">{admin.role}</span>
                {admin.role !== "Owner" ? <Trash2 className="h-4 w-4 text-ink/40" /> : null}
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-teal" />
          <h2 className="text-base font-semibold text-ink">Privacy and consent</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <PrivacyColumn
            title="What admins can see"
            tone="green"
            items={["Who has been invited and whether they have signed up", "Aggregated team health once the cohort reaches the privacy threshold", "Billing totals and membership status"]}
          />
          <PrivacyColumn
            title="What admins can never see"
            tone="red"
            items={["Any individual's biomarkers or biological age", "Health data tied to a name", "Small subgroup results that could identify a person"]}
          />
        </div>
      </section>
    </>
  );
}

function SettingsField({ label, value }: { label: string; value: string }) {
  return (
    <label className="mb-4 block text-sm font-medium text-ink/60 last:mb-0">
      {label}
      <input readOnly value={value} className="mt-2 h-11 w-full rounded-md border border-ink/10 bg-mist px-3 text-sm text-ink outline-none" />
    </label>
  );
}

function PrivacyColumn({ title, items, tone }: { title: string; items: string[]; tone: "green" | "red" }) {
  const markerClass = tone === "green" ? "text-teal" : "text-coral";
  const Marker = tone === "green" ? Check : X;
  return (
    <div>
      <h3 className={`text-xs font-semibold uppercase tracking-normal ${markerClass}`}>{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-ink/65">
            <Marker className={`mt-1 h-4 w-4 shrink-0 ${markerClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
