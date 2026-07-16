import { AlertTriangle, Apple, CheckCircle2, FlaskConical, Footprints, Lightbulb, Moon, Salad, Sparkles, Stethoscope, Target, Users } from "lucide-react";
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
  const strongestCategories = metrics ? [...metrics.category_distribution].sort((a, b) => b.optimal - a.optimal).slice(0, 3) : [];
  const needsAttentionCategories = metrics ? [...metrics.category_distribution].sort((a, b) => b.needs_attention - a.needs_attention).slice(0, 3) : [];
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
            <MetricCard label="In range" value={`${metrics.in_range_biomarker_percentage}%`} helper="Within reference range" icon={Target} />
            <MetricCard label="Needs attention" value={`${metrics.needs_attention_percentage}%`} helper="Outside normal range" icon={AlertTriangle} />
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
          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Category summary</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <CategoryList title="Strongest categories" items={strongestCategories} valueKey="optimal" suffix="optimal" tone="green" />
              <CategoryList title="Needs attention" items={needsAttentionCategories} valueKey="needs_attention" suffix="needs attention" tone="amber" />
            </div>
          </section>
          <HealthCategoryMatrix categories={metrics.category_distribution} />
          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-teal" />
              <div>
                <h2 className="text-base font-semibold text-ink">Ways to support your team</h2>
                <p className="mt-1 text-sm text-ink/55">Above and beyond the guidance already in the Vively app.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <SupportIdea icon={Salad} title="Book a Vively dietitian lunch and learn" text="Nutrients and Metabolic show the most room to improve. A team session with a Vively dietitian builds on the plans already in the app." />
              <SupportIdea icon={Footprints} title="Make movement the default" text="Walking meetings, standing desks, and short movement breaks support the team's Heart and Metabolic markers." />
              <SupportIdea icon={Moon} title="Protect recovery time" text="Easing after-hours meeting culture helps the team's Inflammation picture over time." />
              <SupportIdea icon={Apple} title="Cater for the baseline" text="Default to higher-protein, wholefood catering so the healthy choice is the easy one." />
            </div>
          </section>
          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">What every employee gets</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <SupportIdea icon={FlaskConical} title="Two Baseline Health Checks a year" text="Blood baselines at our accredited partner collection centres, included for Medicare-eligible employees." />
              <SupportIdea icon={Sparkles} title="A personalised plan" text="Clear focus areas based on their own results." />
              <SupportIdea icon={Stethoscope} title="Guidance from nurses and dietitians" text="Ongoing support from the Vively care team." />
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function CategoryList({
  title,
  items,
  valueKey,
  suffix,
  tone,
}: {
  title: string;
  items: HealthMetricCohort["category_distribution"];
  valueKey: "optimal" | "needs_attention";
  suffix: string;
  tone: "green" | "amber";
}) {
  const pillClass = tone === "green" ? "bg-sage/15 text-teal" : "bg-amber-50 text-amber-900";

  return (
    <div className="rounded-md bg-mist p-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.category} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
            <span className="text-sm font-medium text-ink/75">{item.category}</span>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${pillClass}`}>
              {item[valueKey]}% {suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportIdea({ icon: Icon, title, text }: { icon: typeof Lightbulb; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-md bg-mist p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-teal">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-ink/60">{text}</p>
      </div>
    </div>
  );
}
