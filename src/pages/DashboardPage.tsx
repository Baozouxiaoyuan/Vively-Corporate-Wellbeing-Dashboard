import { Activity, CheckCircle2, CreditCard, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getActivationSummary, getBillingSummary, getCorporateAccount, getHealthMetrics } from "../api/mockApi";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { PrivacyNotice } from "../components/ui/PrivacyNotice";
import { StatusBadge } from "../components/ui/StatusBadge";
import { ActivationSummary, BillingSummary, CorporateAccount, HealthMetricCohort } from "../types/corporate";
import { formatCurrency } from "../utils/format";

export function DashboardPage() {
  const [account, setAccount] = useState<CorporateAccount | null>(null);
  const [activation, setActivation] = useState<ActivationSummary | null>(null);
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [health, setHealth] = useState<HealthMetricCohort | null>(null);

  useEffect(() => {
    void Promise.all([getCorporateAccount(), getActivationSummary(), getBillingSummary(), getHealthMetrics("All Teams")]).then(([accountData, activationData, billingData, healthData]) => {
      setAccount(accountData);
      setActivation(activationData);
      setBilling(billingData);
      setHealth(healthData);
    });
  }, []);

  if (!account || !activation || !billing || !health) return null;

  const focusCategory = health.category_distribution.reduce(
    (highest, category) => (category.needs_attention > highest.needs_attention ? category : highest),
    health.category_distribution[0],
  );

  return (
    <>
      <PageHeader title="Dashboard" description="A frontend-first corporate wellbeing overview powered by lightweight mock API functions." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Employees invited" value={activation.total_invited} helper={`${activation.opened_invites} opened invites`} icon={Users} />
        <MetricCard label="Active memberships" value={activation.active_memberships} helper={`${activation.membership_rate}% membership rate`} icon={CheckCircle2} />
        <MetricCard label="Activation rate" value={`${activation.activation_rate}%`} helper="Continued from invite into Vively" icon={TrendingUp} />
        <MetricCard label="Current billing" value={formatCurrency(billing.current_amount_cents)} helper={billing.current_period} icon={CreditCard} />
      </div>
      <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold">health snapshot</h2>
            <p className="mt-1 text-sm text-ink/55">All Teams cohort</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[520px]">
            <Info label="Cohort size" value={`${health.cohort_size} employees`} />
            <Info label="Optimal markers" value={`${health.optimal_biomarker_percentage}%`} />
            <Info label="Focus area" value={`${focusCategory.category} (${focusCategory.needs_attention}%)`} />
          </div>
          <ShieldCheck className="hidden h-6 w-6 text-teal lg:block" />
        </div>
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft lg:col-span-2">
          <h2 className="text-base font-semibold">Corporate account</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Info label="Company" value={account.company_name} />
            <Info label="Admin" value={account.admin_name} />
            <Info label="Invite code" value={account.invite_code} />
            <Info label="Plan price" value={`${formatCurrency(account.plan_price_cents)} per employee`} />
          </div>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Billing status</h2>
            <StatusBadge value={billing.current_status} />
          </div>
          <div className="mt-5 flex items-center gap-3 text-ink/65">
            <Activity className="h-5 w-5 text-teal" />
            <p className="text-sm">Prototype billing uses mock charges only. No payment processing is connected.</p>
          </div>
        </section>
      </div>
      <div className="mt-6">
        <PrivacyNotice />
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-normal text-ink/45">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink/80">{value}</p>
    </div>
  );
}
