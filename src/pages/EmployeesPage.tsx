import { Copy, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { createEmployeeInvite, getEmployees } from "../api/mockApi";
import { DataTable } from "../components/ui/DataTable";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { CorporatePatient } from "../types/corporate";

export function EmployeesPage() {
  const [employees, setEmployees] = useState<CorporatePatient[]>([]);
  const [form, setForm] = useState({ email: "", full_name: "", team_name: "", has_medicare: true });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    void getEmployees().then(setEmployees);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const created = await createEmployeeInvite(form);
    setEmployees((current) => [created, ...current]);
    setForm({ email: "", full_name: "", team_name: "", has_medicare: true });
  }

  async function copyInvite(token: string) {
    const link = `${window.location.origin}/join/${token}`;
    await navigator.clipboard.writeText(link);
    setCopiedToken(token);
    window.setTimeout(() => setCopiedToken(null), 1600);
  }

  return (
    <>
      <PageHeader title="Employees" description="Invite employees and track their corporate onboarding status without exposing health records." />
      <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto_auto] lg:items-end">
          <Field label="Full name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} required />
          <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
          <Field label="Team" value={form.team_name} onChange={(value) => setForm({ ...form, team_name: value })} required />
          <label className="flex h-10 items-center gap-2 rounded-md border border-ink/10 px-3 text-sm text-ink/70">
            <input type="checkbox" checked={form.has_medicare} onChange={(event) => setForm({ ...form, has_medicare: event.target.checked })} />
            Medicare
          </label>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal px-4 text-sm font-semibold text-white hover:bg-teal/90">
            <Plus className="h-4 w-4" />
            Invite
          </button>
        </div>
      </form>
      <DataTable
        data={employees}
        getKey={(employee) => employee.id}
        columns={[
          { header: "Name", cell: (employee) => <span className="font-medium text-ink">{employee.full_name}</span> },
          { header: "Email", cell: (employee) => employee.email },
          { header: "Team", cell: (employee) => employee.team_name },
          { header: "Invite", cell: (employee) => <StatusBadge value={employee.invite_status} /> },
          { header: "Signup match", cell: (employee) => <StatusBadge value={employee.signup_match_status} /> },
          { header: "Baseline", cell: (employee) => <StatusBadge value={employee.baseline_status} /> },
          { header: "Membership", cell: (employee) => <StatusBadge value={employee.membership_status} /> },
          {
            header: "Invite link",
            cell: (employee) => (
              <button onClick={() => void copyInvite(employee.invite_token)} className="inline-flex items-center gap-2 rounded-md border border-ink/10 px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/10">
                <Copy className="h-3.5 w-3.5" />
                {copiedToken === employee.invite_token ? "Copied" : "Copy"}
              </button>
            ),
          },
        ]}
      />
    </>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-ink/70">
      {label}
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-ink/10 px-3 outline-none focus:border-teal" />
    </label>
  );
}
