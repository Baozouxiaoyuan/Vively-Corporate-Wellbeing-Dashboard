import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon?: LucideIcon;
}

export function MetricCard({ label, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink/60">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-ink">{value}</p>
        </div>
        {Icon ? (
          <div className="grid h-10 w-10 place-items-center rounded-md bg-sage/12 text-teal">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {helper ? <p className="mt-3 text-sm text-ink/55">{helper}</p> : null}
    </section>
  );
}
