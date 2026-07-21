import { CreditCard, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getBillingSummary } from "../api";
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
      <PageHeader title="Billing" description="Card-on-file billing for the corporate MVP. Payment processing is represented as prototype data only." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Annual price" value={formatCurrency(summary.account.plan_price_cents)} helper="Per activated employee" icon={CreditCard} />
        <MetricCard label="Billable employees" value={summary.employee_count} helper="Activated this billing period" icon={Users} />
        <MetricCard label="Current period" value={summary.current_period} helper={summary.account.company_name} />
        <MetricCard label="Amount due" value={formatCurrency(summary.current_amount_cents)} helper={summary.current_status} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold">Current company plan</h2>
              <p className="mt-1 text-sm text-ink/60">
                {summary.account.company_name} is billed {formatCurrency(summary.account.plan_price_cents)} per employee per year when an employee activates.
              </p>
              <p className="mt-2 text-sm text-ink/60">
                Two Baseline Health Checks are included for Medicare-eligible employees. Non-Medicare employees may incur a test surcharge.
              </p>
            </div>
            <StatusBadge value={summary.current_status} />
          </div>
        </section>
        <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-teal" />
            <div>
              <h2 className="text-base font-semibold">Payment method</h2>
              <p className="mt-1 text-sm text-ink/60">Visa ending in 4242. Raw card details are never stored by Vively.</p>
              <p className="mt-2 text-sm text-ink/60">Production card capture should use Stripe Elements or an equivalent tokenised provider.</p>
            </div>
          </div>
        </section>
      </div>
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
