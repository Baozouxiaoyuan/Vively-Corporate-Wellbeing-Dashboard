import { HealthMetricCohort } from "../../types/corporate";

type CategoryMetric = HealthMetricCohort["category_distribution"][number];

interface HealthCategoryMatrixProps {
  categories: CategoryMetric[];
}

export function HealthCategoryMatrix({ categories }: HealthCategoryMatrixProps) {
  return (
    <section className="rounded-[28px] border border-[#e8d9c9] bg-white px-6 py-7 shadow-soft sm:px-10 sm:py-9">
      <h2 className="text-xl font-semibold tracking-normal text-[#171212] sm:text-2xl">
        Health categories across the team
      </h2>

      <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2">
        {categories.map((category) => (
          <CategoryRow key={category.category} category={category} />
        ))}
      </div>

      <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/60 sm:text-base">
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
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-normal text-[#171212]">{category.category}</h3>
        <p className="shrink-0 text-lg text-ink/55">{category.optimal}% optimal</p>
      </div>
      <div className="flex h-6 w-full overflow-hidden rounded-full bg-ink/10">
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
      <span className={`h-4 w-4 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}
