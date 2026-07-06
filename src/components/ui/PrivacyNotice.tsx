import { ShieldCheck } from "lucide-react";

export function PrivacyNotice() {
  return (
    <div className="rounded-lg border border-teal/20 bg-teal/10 p-4 text-sm text-ink/70">
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
  return (
    <section className="rounded-lg border border-dashed border-ink/20 bg-white p-8 text-center shadow-soft">
      <ShieldCheck className="mx-auto h-10 w-10 text-teal" />
      <h2 className="mt-3 text-lg font-semibold">Insufficient Data</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-ink/60">
        This cohort has {cohortSize} employees. Aggregate health metrics are shown only
        when at least {threshold} employees are included.
      </p>
    </section>
  );
}
