import { CheckCircle2, Copy, ExternalLink, MailOpen, MousePointerClick, Plus, Search, Send, UserCheck, Users, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createEmployeeInvite, getActivationSummary, getEmployees, removeEmployee, sendEmployeeInviteEmail } from "../api";
import { DataTable } from "../components/ui/DataTable";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Button } from "../components/vively-ui/Button";
import { Input } from "../components/vively-ui/Input";
import { productConfig } from "../config/product";
import { ActivationSummary, CorporatePatient } from "../types/corporate";

export function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState<CorporatePatient[]>([]);
  const [summary, setSummary] = useState<ActivationSummary | null>(null);
  const [form, setForm] = useState({ email: "", full_name: "", team_name: productConfig.teams[0], has_medicare: true });
  const [customTeam, setCustomTeam] = useState("");
  const [search, setSearch] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [sendingEmailIds, setSendingEmailIds] = useState<number[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    void Promise.all([getEmployees(), getActivationSummary()]).then(([employeesData, summaryData]) => {
      setEmployees(employeesData);
      setSummary(summaryData);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get("invite") === "1") {
      setInviteOpen(true);
    }
  }, [searchParams]);

  function closeInviteDialog() {
    setInviteOpen(false);
    if (searchParams.has("invite")) {
      setSearchParams({});
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const teamName = form.team_name === "Custom" ? customTeam.trim() : form.team_name;
    if (!teamName) return;

    const created = await createEmployeeInvite({ ...form, team_name: teamName });
    setEmployees((current) => [created, ...current]);
    setSummary(await getActivationSummary());
    setForm({ email: "", full_name: "", team_name: productConfig.teams[0], has_medicare: true });
    setCustomTeam("");
    closeInviteDialog();
  }

  async function copyInvite(token: string) {
    const link = `${window.location.origin}/join/${token}`;
    await navigator.clipboard.writeText(link);
    setCopiedToken(token);
    window.setTimeout(() => setCopiedToken(null), 1600);
  }

  async function sendInviteEmail(employeeId: number) {
    setSendingEmailIds((current) => [...current, employeeId]);
    const updatedEmployee = await sendEmployeeInviteEmail(employeeId);
    setEmployees((current) => current.map((employee) => (employee.id === employeeId ? updatedEmployee : employee)));
    setSendingEmailIds((current) => current.filter((id) => id !== employeeId));
  }

  async function handleRemoveEmployee(employee: CorporatePatient) {
    const confirmed = window.confirm(`Remove ${employee.full_name} from this corporate list?`);
    if (!confirmed) return;

    await removeEmployee(employee.id);
    setEmployees((current) => current.filter((item) => item.id !== employee.id));
    setSummary(await getActivationSummary());
  }

  const filteredEmployees = employees.filter((employee) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [employee.full_name, employee.email, employee.team_name].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <>
      <PageHeader
        title="People"
        description="Invite employees, send onboarding emails and monitor activation progress from one operational view."
        action={
          <Button type="button" className="h-11 px-5" onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" />
            Invite employees
          </Button>
        }
      />
      {summary ? (
        <>
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
          <section className="my-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
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
        </>
      ) : null}
      {inviteOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 px-4 py-8">
          <div className="max-h-full w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-normal text-ink">Invite employees</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
                  Employees receive an invitation to set up Vively and book their Baseline. Each employee is billed from the card on file when they sign up.
                </p>
              </div>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-md text-ink/55 hover:bg-mist" onClick={closeInviteDialog} aria-label="Close invite dialog">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} required />
                  <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <TeamField value={form.team_name} customTeam={customTeam} onChange={(value) => setForm({ ...form, team_name: value })} onCustomTeamChange={setCustomTeam} />
                  <label className="flex h-10 items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-4 text-sm text-ink/70">
                    <input type="checkbox" checked={form.has_medicare} onChange={(event) => setForm({ ...form, has_medicare: event.target.checked })} />
                    Medicare
                  </label>
                </div>
                <div className="flex flex-col gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-ink/55">{form.email ? "1 ready to invite" : "0 ready to invite"}</p>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={closeInviteDialog}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Send className="h-4 w-4" />
                      Send invitation
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-ink/10 bg-mist px-3 py-2 text-sm text-ink/70 sm:max-w-md">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search employees, emails or teams"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink/45"
          />
        </label>
        <p className="text-sm text-ink/55">{filteredEmployees.length} employees shown</p>
      </div>
      <DataTable
        data={filteredEmployees}
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
              <Button type="button" variant="secondary" size="s" onClick={() => void copyInvite(employee.invite_token)}>
                <Copy className="h-3.5 w-3.5" />
                {copiedToken === employee.invite_token ? "Copied" : "Copy"}
              </Button>
            ),
          },
          {
            header: "Action",
            cell: (employee) => {
              const isSending = sendingEmailIds.includes(employee.id);
              const emailLabel = employee.email_sent_at ? "Resend" : "Send email";

              return (
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="subtle" size="s" loading={isSending} onClick={() => void sendInviteEmail(employee.id)}>
                    <Send className="h-3.5 w-3.5" />
                    {emailLabel}
                  </Button>
                  <Button type="button" variant="secondary" size="s" onClick={() => void handleRemoveEmployee(employee)}>
                    Remove
                  </Button>
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}

function TeamField({
  value,
  customTeam,
  onChange,
  onCustomTeamChange,
}: {
  value: string;
  customTeam: string;
  onChange: (value: string) => void;
  onCustomTeamChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-ink/70">
      Team
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/10"
      >
        {productConfig.teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
        <option value="Custom">Custom team...</option>
      </select>
      {value === "Custom" ? (
        <Input
          required
          value={customTeam}
          onChange={(event) => onCustomTeamChange(event.target.value)}
          placeholder="Enter team name"
          className="mt-2"
        />
      ) : null}
    </label>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-ink/70">
      {label}
      <Input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2" />
    </label>
  );
}
