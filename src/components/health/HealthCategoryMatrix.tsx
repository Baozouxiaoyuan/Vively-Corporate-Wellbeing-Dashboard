import { HealthMetricCohort } from "../../types/corporate";

type CategoryMetric = HealthMetricCohort["category_distribution"][number];

interface HealthCategoryMatrixProps {
  categories: CategoryMetric[];
}

export function HealthCategoryMatrix({ categories }: HealthCategoryMatrixProps) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-normal text-ink">Health categories across the team</h2>
          <p className="mt-1 text-sm text-ink/55">Each bar shows the aggregate status split for a health category.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-x-10 gap-y-6 lg:grid-cols-2">
        {categories.map((category) => (
          <CategoryRow key={category.category} category={category} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink/60">
        <LegendItem color="bg-[#4ca274]" label="Optimal" />
        <LegendItem color="bg-[#e7be42]" label="In range" />
        <LegendItem color="bg-[#c84242]" label="Needs attention" />
      </div>
    </section>
  );
}

function CategoryRow({ category }: { category: CategoryMetric }) {
  const inRange = Math.max(0, category.in_range);
  const needsAttention = Math.max(0, category.needs_attention);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-semibold tracking-normal text-ink">{category.category}</h3>
        <p className="shrink-0 text-sm text-ink/55">{category.optimal}% optimal</p>
      </div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-ink/10">
        <div className="bg-[#4ca274]" style={{ width: `${category.optimal}%` }} />
        <div className="bg-[#e7be42]" style={{ width: `${inRange}%` }} />
        <div className="bg-[#c84242]" style={{ width: `${needsAttention}%` }} />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}
