import { ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getHealthMetrics } from "../api/mockApi";
import { HealthCategoryMatrix } from "../components/health/HealthCategoryMatrix";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { InsufficientData, PrivacyNotice } from "../components/ui/PrivacyNotice";
import { healthMetricsMock } from "../data/healthMetrics.mock";
import { HealthMetricCohort } from "../types/corporate";

const PRIVACY_THRESHOLD = 10;

export function HealthMetricsPage() {
  const [team, setTeam] = useState("All Teams");
  const [metrics, setMetrics] = useState<HealthMetricCohort | null>(null);

  useEffect(() => {
    void getHealthMetrics(team).then(setMetrics);
  }, [team]);

  const teams = healthMetricsMock.map((item) => item.team);

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
      {!metrics ? null : metrics.cohort_size < PRIVACY_THRESHOLD ? (
        <div className="mt-6">
          <InsufficientData threshold={PRIVACY_THRESHOLD} cohortSize={metrics.cohort_size} />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Cohort size" value={metrics.cohort_size} icon={ShieldCheck} />
            <MetricCard label="Avg Vively score" value={metrics.average_vively_score} helper={`+${metrics.score_change} pts`} icon={TrendingUp} />
            <MetricCard label="Optimal" value={`${metrics.optimal_biomarker_percentage}%`} helper="Biomarker share" />
            <MetricCard label="In range" value={`${metrics.in_range_biomarker_percentage}%`} helper="Biomarker share" />
            <MetricCard label="Needs attention" value={`${metrics.needs_attention_percentage}%`} helper="Biomarker share" />
          </div>
          <HealthCategoryMatrix categories={metrics.category_distribution} />
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
              <h2 className="mb-4 text-base font-semibold">Vively score trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.trend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis domain={[60, 90]} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#237a73" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
