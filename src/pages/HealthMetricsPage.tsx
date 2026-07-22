import { AlertTriangle, Apple, BarChart3, CheckCircle2, Download, FlaskConical, Footprints, Lightbulb, Moon, Salad, Sparkles, Stethoscope, Target, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getHealthMetrics, getTeams } from "../api";
import { HealthCategoryMatrix } from "../components/health/HealthCategoryMatrix";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { InsufficientData, PrivacyNotice } from "../components/ui/PrivacyNotice";
import { productConfig } from "../config/product";
import { HealthMetricCohort } from "../types/corporate";

const futureTeamSignals = [
  { icon: Zap, title: "Energy and wellbeing", value: "7.6 / 10", text: "From quick in-app check-ins. Linked to job satisfaction." },
  { icon: TrendingUp, title: "Productivity signal", value: "Tailwind", text: "Higher vitality is associated with fewer sick days and sharper focus." },
  { icon: CheckCircle2, title: "Feeling energised", value: "78%", text: "Members reporting good energy on most days." },
];

const comparisonRows = [
  { label: "Team Vitality", yourTeam: "76 / 100", vivelyTeams: "70 / 100", australia: "64 / 100" },
  { label: "Biological vs actual age", yourTeam: "0.7 yrs younger", vivelyTeams: "0.2 yrs younger", australia: "0.5 yrs older" },
  { label: "Speed of aging", yourTeam: "1.01 yrs/yr", vivelyTeams: "1.04 yrs/yr", australia: "1.07 yrs/yr" },
  { label: "Markers in optimal range", yourTeam: "57%", vivelyTeams: "53%", australia: "49%" },
];

export function HealthMetricsPage() {
  const [team, setTeam] = useState("All Teams");
  const [teams, setTeams] = useState<string[]>(["All Teams", ...productConfig.teams]);
  const [metrics, setMetrics] = useState<HealthMetricCohort | null>(null);

  useEffect(() => {
    void getTeams().then(setTeams);
  }, []);

  useEffect(() => {
    void getHealthMetrics(team).then(setMetrics);
  }, [team]);

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
        title="How your team is really doing"
        titleStyle="serif"
        description={metrics ? `Based on ${metrics.cohort_size} completed Baselines. Aggregated and de-identified.` : "Anonymised aggregate health signals for cohorts that meet the privacy threshold."}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <select value={team} onChange={(event) => setTeam(event.target.value)} className="h-10 rounded-md border border-ink/10 bg-white px-3 text-sm outline-none focus:border-teal">
              {teams.map((teamName) => (
                <option key={teamName}>{teamName}</option>
              ))}
            </select>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-4 text-sm font-semibold text-ink/70 hover:bg-mist">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        }
      />
      <section className="mt-5 rounded-2xl bg-dark-green-900 px-6 py-6 text-white shadow-soft sm:px-7">
        <p className="font-serif text-2xl leading-snug sm:text-3xl">
          Your team's vitality is <span className="font-semibold">strong and climbing</span>, tracking younger than the Australian average.
        </p>
      </section>
      {!metrics ? null : metrics.cohort_size < productConfig.privacyThreshold ? (
        <div className="mt-6 space-y-6">
          <InsufficientData threshold={productConfig.privacyThreshold} cohortSize={metrics.cohort_size} />
          <PrivacyNotice />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-teal" />
                <h2 className="text-base font-semibold text-ink">Vitality score</h2>
              </div>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-serif text-6xl text-ink">76 <span className="font-sans text-2xl text-ink/45">/ 100</span></p>
                  <span className="mt-3 inline-flex rounded-full bg-sage/15 px-4 py-2 text-sm font-semibold text-teal">Strong, and rising</span>
                </div>
                <div className="w-full sm:w-56">
                  <p className="mb-2 text-right text-xs text-ink/45">Since February</p>
                  <div className="relative h-20 rounded-md bg-mist">
                    <svg viewBox="0 0 180 80" className="h-full w-full" aria-hidden="true">
                      <path d="M18 60 L56 54 L98 40 L136 31 L162 26 L162 74 L18 74 Z" fill="#dff0df" />
                      <path d="M18 60 L56 54 L98 40 L136 31 L162 26" fill="none" stroke="#4f9f77" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="162" cy="26" r="5" fill="#4f9f77" />
                    </svg>
                  </div>
                  <p className="mt-2 text-right text-sm font-semibold text-teal">+5 points</p>
                </div>
              </div>
            </section>
            <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-teal" />
                <h2 className="text-base font-semibold text-ink">What this means for your team</h2>
              </div>
              <div className="mt-5 space-y-4">
                {futureTeamSignals.map((item) => (
                  <TeamSignal key={item.title} {...item} />
                ))}
              </div>
            </section>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Cohort size" value={metrics.cohort_size} helper={`Threshold: ${productConfig.privacyThreshold}+ employees`} icon={Users} />
            <MetricCard label="Optimal biomarkers" value={`${metrics.optimal_biomarker_percentage}%`} helper={`${metrics.in_range_biomarker_percentage}% are still in range`} icon={CheckCircle2} />
            <MetricCard label="In range" value={`${metrics.in_range_biomarker_percentage}%`} helper="Within reference range" icon={Target} />
            <MetricCard label="Needs attention" value={`${metrics.needs_attention_percentage}%`} helper="Outside normal range" icon={AlertTriangle} />
          </div>
          <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
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
          <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Category summary</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <CategoryList title="Strongest categories" items={strongestCategories} valueKey="optimal" suffix="optimal" tone="green" />
              <CategoryList title="Needs attention" items={needsAttentionCategories} valueKey="needs_attention" suffix="needs attention" tone="amber" />
            </div>
          </section>
          <TeamComparison />
          <HealthCategoryMatrix categories={metrics.category_distribution} />
          <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
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
          <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="text-base font-semibold text-ink">What every employee gets</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <SupportIdea icon={FlaskConical} title="Two Baseline Health Checks a year" text="Blood baselines at our accredited partner collection centres, included for Medicare-eligible employees." />
              <SupportIdea icon={Sparkles} title="A personalised plan" text="Clear focus areas based on their own results." />
              <SupportIdea icon={Stethoscope} title="Guidance from nurses and dietitians" text="Ongoing support from the Vively care team." />
            </div>
          </section>
          <PrivacyNotice />
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

function TeamSignal({ icon: Icon, title, value, text }: { icon: typeof Lightbulb; title: string; value: string; text: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-ink/10 pb-4 last:border-0 last:pb-0">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-mist text-teal">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm leading-5 text-ink/55">{text}</p>
      </div>
      <p className="shrink-0 text-right font-serif text-2xl text-dark-green-900">{value}</p>
    </div>
  );
}

function TeamComparison() {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <BarChart3 className="mt-0.5 h-5 w-5 text-teal" />
        <div>
          <h2 className="text-base font-semibold text-ink">How your team compares</h2>
          <p className="mt-1 text-sm text-ink/55">Against other Vively teams and the Australian age-matched average. De-identified.</p>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-normal text-ink/45">
              <th className="py-3 font-semibold">Metric</th>
              <th className="py-3 text-center font-semibold text-dark-green-900">Your team</th>
              <th className="py-3 text-center font-semibold">Vively teams</th>
              <th className="py-3 text-center font-semibold">Australia</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label} className="border-b border-ink/10 last:border-0">
                <td className="py-4 font-medium text-ink">{row.label}</td>
                <td className="py-4 text-center">
                  <span className="inline-flex min-w-40 justify-center rounded-md bg-sage/15 px-4 py-2 font-semibold text-dark-green-900">{row.yourTeam}</span>
                </td>
                <td className="py-4 text-center text-ink/60">{row.vivelyTeams}</td>
                <td className="py-4 text-center text-ink/60">{row.australia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-mist">
          <div className="h-full w-[68%] rounded-full bg-teal" />
        </div>
        <p className="text-sm font-semibold text-ink/70">Ahead of 68% of Vively teams</p>
      </div>
    </section>
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
