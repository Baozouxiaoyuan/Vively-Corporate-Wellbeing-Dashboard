const styles: Record<string, string> = {
  invited: "bg-blue-50 text-blue-700 border-blue-200",
  opened: "bg-amber-50 text-amber-700 border-amber-200",
  continued_to_vively: "bg-teal/10 text-teal border-teal/20",
  found: "bg-emerald-50 text-emerald-700 border-emerald-200",
  not_found: "bg-slate-50 text-slate-600 border-slate-200",
  inactive: "bg-slate-50 text-slate-600 border-slate-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  not_started: "bg-slate-50 text-slate-600 border-slate-200",
  booked: "bg-indigo-50 text-indigo-700 border-indigo-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  charged: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-coral/10 text-coral border-coral/20",
  enrollment: "bg-blue-50 text-blue-700 border-blue-200",
  test_surcharge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  monthly_subscription: "bg-teal/10 text-teal border-teal/20",
};

const labels: Record<string, string> = {
  continued_to_vively: "Continued",
  not_found: "Not found",
  not_started: "Not started",
  test_surcharge: "Test surcharge",
  monthly_subscription: "Monthly",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[value] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {labels[value] ?? value.replace(/_/g, " ")}
    </span>
  );
}
