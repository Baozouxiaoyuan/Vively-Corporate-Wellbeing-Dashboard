import {
  ActivationSummary,
  BillingSummary,
  CorporateAccount,
  CorporatePatient,
  CreateEmployeeInviteInput,
  HealthMetricCohort,
  VivelyEmailResolverResult,
} from "../types/corporate";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export function getCorporateAccount(): Promise<CorporateAccount> {
  return request("/corporate-account");
}

export function getEmployees(): Promise<CorporatePatient[]> {
  return request("/employees");
}

export function getTeams(): Promise<string[]> {
  return request("/teams");
}

export function resolveVivelyUserByEmail(email: string): Promise<VivelyEmailResolverResult> {
  return request(`/vively/resolve-user?email=${encodeURIComponent(email)}`);
}

export function createEmployeeInvite(input: CreateEmployeeInviteInput): Promise<CorporatePatient> {
  return request("/employees/invite", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function sendEmployeeInviteEmail(employeeId: number): Promise<CorporatePatient> {
  return request(`/employees/${employeeId}/send-invite`, {
    method: "POST",
  });
}

export async function removeEmployee(employeeId: number): Promise<void> {
  await request<{ ok: boolean }>(`/employees/${employeeId}`, {
    method: "DELETE",
  });
}

export function getActivationSummary(): Promise<ActivationSummary> {
  return request("/activation-summary");
}

export function getHealthMetrics(team = "All Teams"): Promise<HealthMetricCohort> {
  return request(`/health-metrics?team=${encodeURIComponent(team)}`);
}

export function getBillingSummary(): Promise<BillingSummary> {
  return request("/billing-summary");
}
