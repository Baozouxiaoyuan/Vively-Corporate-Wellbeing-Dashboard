import { AlertTriangle, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getHealthMetrics } from "../api/mockApi";
import { HealthCategoryMatrix } from "../components/health/HealthCategoryMatrix";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { InsufficientData, PrivacyNotice } from "../components/ui/PrivacyNotice";
import { productConfig } from "../config/product";
import { healthMetricsMock } from "../data/healthMetrics.mock";
import { HealthMetricCohort } from "../types/corporate";

export function HealthMetricsPage() {
  const [team, setTeam] = useState("All Teams");
  const [metrics, setMetrics] = useState<HealthMetricCohort | null>(null);

  useEffect(() => {
    void getHealthMetrics(team).then(setMetrics);
  }, [team]);

  const teams = healthMetricsMock.map((item) => item.team);
  const bestCategory = metrics?.category_distribution.reduce((best, category) => (category.optimal > best.optimal ? category : best), metrics.category_distribution[0]);
  const attentionCategory = metrics?.category_distribution.reduce(
    (highest, category) => (category.needs_attention > highest.needs_attention ? category : highest),
    metrics.category_distribution[0],
  );
  const biomarkerStatus = metrics
    ? [
        { status: "Optimal", value: metrics.optimal_biomarker_percentage },
        { status: "In range", value: metrics.in_range_biomarker_percentage },
        { status: "Needs attention", value: metrics.needs_attention_percentage },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Health Metrics"
        description="Anonymised aggregate health signals for cohorts that meet the privacy threshold."
        action={
          <select value={team} onChange={(event) => setTeam(event.target.value)} className="h-10 rounded-md border border-ink/10 bg-white px-3 text-sm outline-none focus:border-teal">
            {teams.map((teamName) => (
              <option key={teamName}>{teamName}</option>
            ))}
          </select>
        }
      />
      <PrivacyNotice />
      {!metrics ? null : metrics.cohort_size < productConfig.privacyThreshold ? (
        <div className="mt-6">
          <InsufficientData threshold={productConfig.privacyThreshold} cohortSize={metrics.cohort_size} />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Cohort size" value={metrics.cohort_size} helper={`Threshold: ${productConfig.privacyThreshold}+ employees`} icon={Users} />
            <MetricCard label="Optimal biomarkers" value={`${metrics.optimal_biomarker_percentage}%`} helper={`${metrics.in_range_biomarker_percentage}% are still in range`} icon={CheckCircle2} />
            <MetricCard label="Needs attention" value={`${metrics.needs_attention_percentage}%`} helper="Aggregate share, not individual results" icon={AlertTriangle} />
            <MetricCard label="Strongest category" value={bestCategory?.category ?? "N/A"} helper={`${bestCategory?.optimal ?? 0}% optimal`} icon={ShieldCheck} />
          </div>
          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Biomarker status summary</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={biomarkerStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                  <Bar dataKey="value" fill="#237a73" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          {attentionCategory ? (
            <section className="flex flex-col gap-2 rounded-lg border border-ink/10 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Focus area</p>
                <p className="mt-1 text-sm text-ink/55">Highest needs-attention category in this cohort.</p>
              </div>
              <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">
                {attentionCategory.category}: {attentionCategory.needs_attention}%
              </div>
            </section>
          ) : null}
          <HealthCategoryMatrix categories={metrics.category_distribution} />
        </div>
      )}
    </>
  );
}
