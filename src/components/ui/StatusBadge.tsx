import { Badge } from "../vively-ui/Badge";

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
  test_surcharge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  annual_membership: "bg-teal/10 text-teal border-teal/20",
};

const labels: Record<string, string> = {
  continued_to_vively: "Continued",
  not_found: "Not found",
  not_started: "Not started",
  test_surcharge: "Test surcharge",
  annual_membership: "Annual membership",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={`rounded-full px-2.5 py-1 ${styles[value] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {labels[value] ?? value.replace(/_/g, " ")}
    </Badge>
  );
}
