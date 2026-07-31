import { billingSummaryMock } from "../data/billing.mock";
import { companyMock, membersMock, teamsMock } from "../data/employees.mock";
import { healthMetricsMock } from "../data/healthMetrics.mock";
import {
  ActivationSummary,
  AuthSession,
  BillingSummary,
  Company,
  CorporateMember,
  CorporateTeam,
  CreateMemberInviteInput,
  HealthMetrics,
} from "../types/corporate";

let members = [...membersMock];
let teams = [...teamsMock];

const wait = async (ms = 180) => new Promise((resolve) => window.setTimeout(resolve, ms));

function teamWithCurrentCount(team: CorporateTeam): CorporateTeam {
  return {
    ...team,
    member_count: members.filter((member) => member.team.id === team.id).length,
  };
}

function refreshTeamCounts() {
  teams = teams.map(teamWithCurrentCount);
  members = members.map((member) => ({
    ...member,
    team: teamWithCurrentCount(member.team),
  }));
}

export async function login(email: string, password: string): Promise<AuthSession> {
  await wait();
  const session = {
    access_token: "prototype-token",
    id: 501,
    email,
    first_name: "Ruitao",
    last_name: "Yuan",
    userable_type: "admins",
    userable_id: 12,
  };
  window.localStorage.setItem("vively_access_token", session.access_token);
  return session;
}

export async function getCompany(): Promise<Company> {
  await wait();
  return companyMock;
}

export async function getMembers(): Promise<CorporateMember[]> {
  await wait();
  refreshTeamCounts();
  return [...members];
}

export async function getTeams(): Promise<CorporateTeam[]> {
  await wait();
  refreshTeamCounts();
  return [...teams];
}

export async function createTeam(name: string): Promise<CorporateTeam> {
  await wait();
  const existing = teams.find((team) => team.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  const created = {
    id: Math.max(...teams.map((team) => team.id), 0) + 1,
    name,
    member_count: 0,
    created_at: new Date().toISOString(),
  };
  teams = [...teams, created];
  return created;
}

export async function renameTeam(teamId: number, name: string): Promise<CorporateTeam> {
  await wait();
  teams = teams.map((team) => (team.id === teamId ? { ...team, name } : team));
  members = members.map((member) => (member.team.id === teamId ? { ...member, team: { ...member.team, name } } : member));
  refreshTeamCounts();
  const updated = teams.find((team) => team.id === teamId);
  if (!updated) throw new Error("Team not found");
  return updated;
}

export async function deleteTeam(teamId: number): Promise<void> {
  await wait();
  if (members.some((member) => member.team.id === teamId)) {
    throw new Error("Team still has members");
  }
  teams = teams.filter((team) => team.id !== teamId);
}

export async function createMemberInvite(teamId: number, input: CreateMemberInviteInput): Promise<CorporateMember> {
  await wait();
  const team = teams.find((item) => item.id === teamId);
  if (!team) throw new Error("Team not found");

  const created: CorporateMember = {
    id: Math.max(...members.map((member) => member.id), 0) + 1,
    email: input.email,
    first_name: input.first_name,
    last_name: input.last_name,
    team,
    has_medicare: input.has_medicare,
    invite_status: "invited",
    signup_match_status: "not_found",
    membership_status: "inactive",
    baseline_status: "not_started",
    invited_at: new Date().toISOString(),
    email_sent_at: null,
    opened_at: null,
    signedup_at: null,
    removed_at: null,
    created_at: new Date().toISOString(),
  };
  members = [created, ...members];
  refreshTeamCounts();
  return members[0];
}

export async function sendMemberInvitation(memberId: number): Promise<CorporateMember> {
  await wait(450);
  const member = members.find((item) => item.id === memberId);
  if (!member) throw new Error("Member invite not found");

  const updated = { ...member, email_sent_at: new Date().toISOString() };
  members = members.map((item) => (item.id === memberId ? updated : item));
  return updated;
}

export async function deleteMember(memberId: number): Promise<void> {
  await wait();
  members = members.filter((member) => member.id !== memberId);
  refreshTeamCounts();
}

export async function getActivationSummary(): Promise<ActivationSummary> {
  await wait();
  const total = members.length || 1;
  const opened = members.filter((member) => member.opened_at).length;
  const continued = members.filter((member) => member.invite_status === "continued_to_vively").length;
  const active = members.filter((member) => member.membership_status === "active").length;
  const baseline = members.filter((member) => member.baseline_status === "completed").length;

  return {
    total_members: members.length,
    funnel: {
      invited: members.length,
      opened,
      continued_to_vively: continued,
      active,
      baseline_completed: baseline,
    },
    activation_rate: Number((continued / total).toFixed(2)),
  };
}

export async function getCompanyHealthMetrics(): Promise<HealthMetrics> {
  await wait();
  return healthMetricsMock[0];
}

export async function getTeamHealthMetrics(teamId: number): Promise<HealthMetrics> {
  await wait();
  const existing = healthMetricsMock.find((metric) => metric.team?.id === teamId);
  if (existing) return existing;

  const team = teams.find((item) => item.id === teamId) ?? null;
  const cohortSize = members.filter((member) => member.team.id === teamId).length;
  return {
    scope: "team",
    team,
    cohort_size: cohortSize,
    below_privacy_threshold: cohortSize < 10,
    categories: null,
  };
}

export async function getBilling(): Promise<BillingSummary> {
  await wait();
  return billingSummaryMock;
}
