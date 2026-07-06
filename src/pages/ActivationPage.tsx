import { CheckCircle2, ExternalLink, MailOpen, MousePointerClick, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getActivationSummary, getEmployees } from "../api/mockApi";
import { activationNotesMock } from "../data/activation.mock";
import { DataTable } from "../components/ui/DataTable";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { ActivationSummary, CorporatePatient } from "../types/corporate";

export function ActivationPage() {
  const [summary, setSummary] = useState<ActivationSummary | null>(null);
  const [employees, setEmployees] = useState<CorporatePatient[]>([]);

  useEffect(() => {
    void Promise.all([getActivationSummary(), getEmployees()]).then(([summaryData, employeesData]) => {
      setSummary(summaryData);
      setEmployees(employeesData);
    });
  }, []);

  if (!summary) return null;

  return (
    <>
      <PageHeader title="Activation" description="Monitor invite engagement, Vively continuation and baseline completion across the corporate cohort." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total invited" value={summary.total_invited} icon={Users} />
        <MetricCard label="Opened invites" value={summary.opened_invites} icon={MailOpen} />
        <MetricCard label="Continued to Vively" value={summary.continued_to_vively} icon={ExternalLink} />
        <MetricCard label="Linked employees" value={summary.linked_employees} icon={UserCheck} />
        <MetricCard label="Baseline completed" value={summary.baseline_completed} icon={CheckCircle2} />
        <MetricCard label="Active memberships" value={summary.active_memberships} icon={MousePointerClick} />
        <MetricCard label="Activation rate" value={`${summary.activation_rate}%`} helper="Continued / invited" />
        <MetricCard label="Baseline completion" value={`${summary.baseline_completion_rate}%`} helper={`${summary.membership_rate}% membership rate`} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold">Activation funnel</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.funnel}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#237a73" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold">Prototype notes</h2>
          <div className="mt-4 space-y-3">
            {activationNotesMock.map((note) => (
              <p key={note} className="rounded-md bg-mist p-3 text-sm text-ink/65">
                {note}
              </p>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-6">
        <DataTable
          data={employees}
          getKey={(employee) => employee.id}
          columns={[
            { header: "Employee", cell: (employee) => <span className="font-medium text-ink">{employee.full_name}</span> },
            { header: "Team", cell: (employee) => employee.team_name },
            { header: "Invite", cell: (employee) => <StatusBadge value={employee.invite_status} /> },
            { header: "Signup match", cell: (employee) => <StatusBadge value={employee.signup_match_status} /> },
            { header: "Baseline", cell: (employee) => <StatusBadge value={employee.baseline_status} /> },
            { header: "Membership", cell: (employee) => <StatusBadge value={employee.membership_status} /> },
          ]}
        />
      </div>
    </>
  );
}
