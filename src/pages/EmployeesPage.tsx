import { CheckCircle2, ExternalLink, MailOpen, MousePointerClick, Plus, Search, Send, UserCheck, Users, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createMemberInvite, createTeam, deleteMember, getActivationSummary, getMembers, getTeams, sendMemberInvitation } from "../api";
import { DataTable } from "../components/ui/DataTable";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Button } from "../components/vively-ui/Button";
import { Input } from "../components/vively-ui/Input";
import { ActivationSummary, CorporateMember, CorporateTeam } from "../types/corporate";

type InviteForm = {
  email: string;
  first_name: string;
  last_name: string;
  team_id: string;
  has_medicare: boolean;
};

export function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [members, setMembers] = useState<CorporateMember[]>([]);
  const [teams, setTeams] = useState<CorporateTeam[]>([]);
  const [summary, setSummary] = useState<ActivationSummary | null>(null);
  const [form, setForm] = useState<InviteForm>({ email: "", first_name: "", last_name: "", team_id: "", has_medicare: true });
  const [customTeam, setCustomTeam] = useState("");
  const [search, setSearch] = useState("");
  const [sendingEmailIds, setSendingEmailIds] = useState<number[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    void Promise.all([getMembers(), getTeams(), getActivationSummary()]).then(([membersData, teamsData, summaryData]) => {
      setMembers(membersData);
      setTeams(teamsData);
      setSummary(summaryData);
      setForm((current) => ({ ...current, team_id: String(teamsData[0]?.id ?? "") }));
    });
  }, []);

  useEffect(() => {
    if (searchParams.get("invite") === "1") {
      setInviteOpen(true);
    }
  }, [searchParams]);

  const funnelData = useMemo(() => {
    if (!summary) return [];
    return [
      { stage: "Invited", count: summary.funnel.invited },
      { stage: "Opened", count: summary.funnel.opened },
      { stage: "Continued", count: summary.funnel.continued_to_vively },
      { stage: "Active", count: summary.funnel.active },
      { stage: "Baseline", count: summary.funnel.baseline_completed },
    ];
  }, [summary]);

  function closeInviteDialog() {
    setInviteOpen(false);
    if (searchParams.has("invite")) {
      setSearchParams({});
    }
  }

  async function refreshOperationalData() {
    const [membersData, teamsData, summaryData] = await Promise.all([getMembers(), getTeams(), getActivationSummary()]);
    setMembers(membersData);
    setTeams(teamsData);
    setSummary(summaryData);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let teamId = Number(form.team_id);
    if (form.team_id === "custom") {
      const teamName = customTeam.trim();
      if (!teamName) return;
      const createdTeam = await createTeam(teamName);
      teamId = createdTeam.id;
    }

    const created = await createMemberInvite(teamId, {
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      has_medicare: form.has_medicare,
    });

    await sendMemberInvitation(created.id);
    await refreshOperationalData();
    setForm({ email: "", first_name: "", last_name: "", team_id: String(teamId), has_medicare: true });
    setCustomTeam("");
    closeInviteDialog();
  }

  async function sendInviteEmail(memberId: number) {
    setSendingEmailIds((current) => [...current, memberId]);
    const updatedMember = await sendMemberInvitation(memberId);
    setMembers((current) => current.map((member) => (member.id === memberId ? updatedMember : member)));
    setSendingEmailIds((current) => current.filter((id) => id !== memberId));
  }

  async function handleRemoveMember(member: CorporateMember) {
    const name = memberName(member);
    const confirmed = window.confirm(`Remove ${name} from this corporate list?`);
    if (!confirmed) return;

    await deleteMember(member.id);
    await refreshOperationalData();
  }

  const filteredMembers = members.filter((member) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [memberName(member), member.email, member.team.name].some((value) => value.toLowerCase().includes(query));
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
            <MetricCard label="Total invited" value={summary.total_members} icon={Users} />
            <MetricCard label="Opened invites" value={summary.funnel.opened} icon={MailOpen} />
            <MetricCard label="Continued to Vively" value={summary.funnel.continued_to_vively} icon={ExternalLink} />
            <MetricCard label="Active memberships" value={summary.funnel.active} icon={UserCheck} />
            <MetricCard label="Baseline completed" value={summary.funnel.baseline_completed} icon={CheckCircle2} />
            <MetricCard label="Activation rate" value={`${Math.round(summary.activation_rate * 100)}%`} helper="Continued / invited" icon={MousePointerClick} />
          </div>
          <section className="my-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-base font-semibold">Activation funnel</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData}>
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
                  <Field label="First name" value={form.first_name} onChange={(value) => setForm({ ...form, first_name: value })} required />
                  <Field label="Last name" value={form.last_name} onChange={(value) => setForm({ ...form, last_name: value })} required />
                  <Field label="Work email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
                  <TeamField teams={teams} value={form.team_id} customTeam={customTeam} onChange={(value) => setForm({ ...form, team_id: value })} onCustomTeamChange={setCustomTeam} />
                </div>
                <label className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-4 text-sm text-ink/70">
                  <input type="checkbox" checked={form.has_medicare} onChange={(event) => setForm({ ...form, has_medicare: event.target.checked })} />
                  Medicare eligible
                </label>
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
        <p className="text-sm text-ink/55">{filteredMembers.length} employees shown</p>
      </div>
      <DataTable
        data={filteredMembers}
        getKey={(member) => member.id}
        columns={[
          { header: "Name", cell: (member) => <span className="font-medium text-ink">{memberName(member)}</span> },
          { header: "Email", cell: (member) => member.email },
          { header: "Team", cell: (member) => member.team.name },
          { header: "Invite", cell: (member) => <StatusBadge value={member.invite_status} /> },
          { header: "Signup match", cell: (member) => <StatusBadge value={member.signup_match_status} /> },
          { header: "Baseline", cell: (member) => <StatusBadge value={member.baseline_status} /> },
          { header: "Membership", cell: (member) => <StatusBadge value={member.membership_status} /> },
          {
            header: "Action",
            cell: (member) => {
              const isSending = sendingEmailIds.includes(member.id);

              return (
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="subtle" size="s" loading={isSending} onClick={() => void sendInviteEmail(member.id)}>
                    <Send className="h-3.5 w-3.5" />
                    Resend
                  </Button>
                  <Button type="button" variant="secondary" size="s" onClick={() => void handleRemoveMember(member)}>
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

function memberName(member: CorporateMember) {
  return [member.first_name, member.last_name].filter(Boolean).join(" ");
}

function TeamField({
  teams,
  value,
  customTeam,
  onChange,
  onCustomTeamChange,
}: {
  teams: CorporateTeam[];
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
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
        <option value="custom">Custom team...</option>
      </select>
      {value === "custom" ? (
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
