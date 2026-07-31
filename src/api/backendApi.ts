import {
  ActivationSummary,
  ApiEnvelope,
  AuthSession,
  BillingSummary,
  Company,
  CorporateMember,
  CorporateTeam,
  CreateMemberInviteInput,
  HealthMetrics,
} from "../types/corporate";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4000/v2";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID ?? "1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = window.localStorage.getItem("vively_access_token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? error.detail ?? "Request failed");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const response = await request<ApiEnvelope<AuthSession>>("/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      device: "corporate-dashboard-web",
    }),
  });
  window.localStorage.setItem("vively_access_token", response.data.access_token);
  return response.data;
}

export async function getCompany(): Promise<Company> {
  const response = await request<ApiEnvelope<Company>>(`/companies/${COMPANY_ID}`);
  return response.data;
}

export async function getMembers(): Promise<CorporateMember[]> {
  const response = await request<ApiEnvelope<CorporateMember[]>>(`/companies/${COMPANY_ID}/members`);
  return response.data;
}

export async function getTeams(): Promise<CorporateTeam[]> {
  const response = await request<ApiEnvelope<CorporateTeam[]>>(`/companies/${COMPANY_ID}/teams`);
  return response.data;
}

export async function createTeam(name: string): Promise<CorporateTeam> {
  const response = await request<ApiEnvelope<CorporateTeam>>(`/companies/${COMPANY_ID}/teams`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return response.data;
}

export async function renameTeam(teamId: number, name: string): Promise<CorporateTeam> {
  const response = await request<ApiEnvelope<CorporateTeam>>(`/companies/${COMPANY_ID}/teams/${teamId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
  return response.data;
}

export async function deleteTeam(teamId: number): Promise<void> {
  await request<void>(`/companies/${COMPANY_ID}/teams/${teamId}`, {
    method: "DELETE",
  });
}

export async function createMemberInvite(teamId: number, input: CreateMemberInviteInput): Promise<CorporateMember> {
  const response = await request<ApiEnvelope<CorporateMember>>(`/companies/${COMPANY_ID}/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function sendMemberInvitation(memberId: number): Promise<CorporateMember> {
  const response = await request<ApiEnvelope<CorporateMember>>(`/companies/${COMPANY_ID}/members/${memberId}/invitation`, {
    method: "POST",
  });
  return response.data;
}

export async function deleteMember(memberId: number): Promise<void> {
  await request<void>(`/companies/${COMPANY_ID}/members/${memberId}`, {
    method: "DELETE",
  });
}

export async function getActivationSummary(): Promise<ActivationSummary> {
  const response = await request<ApiEnvelope<ActivationSummary>>(`/companies/${COMPANY_ID}/activation-summary`);
  return response.data;
}

export async function getCompanyHealthMetrics(): Promise<HealthMetrics> {
  const response = await request<ApiEnvelope<HealthMetrics>>(`/companies/${COMPANY_ID}/health-metrics`);
  return response.data;
}

export async function getTeamHealthMetrics(teamId: number): Promise<HealthMetrics> {
  const response = await request<ApiEnvelope<HealthMetrics>>(`/companies/${COMPANY_ID}/teams/${teamId}/health-metrics`);
  return response.data;
}

export async function getBilling(): Promise<BillingSummary> {
  const response = await request<ApiEnvelope<BillingSummary>>(`/companies/${COMPANY_ID}/billing`);
  return response.data;
}
