import { CreditCard, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getBillingSummary } from "../api/mockApi";
import { DataTable } from "../components/ui/DataTable";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { BillingSummary } from "../types/corporate";
import { formatCurrency, formatDate } from "../utils/format";

export function BillingPage() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);

  useEffect(() => {
    void getBillingSummary().then(setSummary);
  }, []);

  if (!summary) return null;

  return (
    <>
      <PageHeader title="Billing" description="Mock billing view for prototype planning. No Stripe or production payment logic is connected." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Plan" value={formatCurrency(summary.account.plan_price_cents)} helper="Per active employee" icon={CreditCard} />
        <MetricCard label="Billable employees" value={summary.employee_count} helper="Current mock period" icon={Users} />
        <MetricCard label="Current period" value={summary.current_period} helper={summary.account.company_name} />
        <MetricCard label="Amount due" value={formatCurrency(summary.current_amount_cents)} helper={summary.current_status} />
      </div>
      <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold">Current company plan</h2>
            <p className="mt-1 text-sm text-ink/60">
              {summary.account.company_name} is using the MVP corporate plan with invite code {summary.account.invite_code}.
            </p>
          </div>
          <StatusBadge value={summary.current_status} />
        </div>
      </section>
      <div className="mt-6">
        <DataTable
          data={summary.history}
          getKey={(charge) => charge.id}
          columns={[
            { header: "Period", cell: (charge) => charge.period },
            { header: "Charge type", cell: (charge) => <StatusBadge value={charge.charge_type} /> },
            { header: "Employees", cell: (charge) => charge.employee_count },
            { header: "Amount", cell: (charge) => <span className="font-semibold text-ink">{formatCurrency(charge.amount_cents)}</span> },
            { header: "Status", cell: (charge) => <StatusBadge value={charge.status} /> },
            { header: "Charged at", cell: (charge) => formatDate(charge.charged_at) },
          ]}
        />
      </div>
    </>
  );
}
