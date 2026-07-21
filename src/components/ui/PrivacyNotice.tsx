import { ShieldCheck } from "lucide-react";

export function PrivacyNotice() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4 text-sm text-ink/70 shadow-soft">
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
        <p>
          Health reporting is anonymised and aggregated. Individual health records,
          patient IDs, raw biomarker rows and per-person results are intentionally hidden.
        </p>
      </div>
    </div>
  );
}

export function InsufficientData({ threshold, cohortSize }: { threshold: number; cohortSize: number }) {
  const progress = Math.min(100, Math.round((cohortSize / threshold) * 100));

  return (
    <section className="rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center shadow-soft">
      <ShieldCheck className="mx-auto h-10 w-10 text-teal" />
      <h2 className="mt-3 text-lg font-semibold">Insufficient Data</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-ink/60">
        This cohort has {cohortSize} employees. Aggregate health metrics are shown only
        when at least {threshold} employees are included.
      </p>
      <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-mist">
          <div className="h-full rounded-full bg-[#4ca274]" style={{ width: `${progress}%` }} />
        </div>
        <p className="shrink-0 text-sm font-semibold text-ink/70">
          {cohortSize} of {threshold} completed
        </p>
      </div>
    </section>
  );
}
