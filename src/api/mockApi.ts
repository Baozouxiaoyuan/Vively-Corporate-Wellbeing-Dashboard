import { billingChargesMock } from "../data/billing.mock";
import { corporateAccountMock, employeesMock } from "../data/employees.mock";
import { healthMetricsMock } from "../data/healthMetrics.mock";
import {
  ActivationSummary,
  BillingSummary,
  CorporatePatient,
  CreateEmployeeInviteInput,
  HealthMetricCohort,
  VivelyEmailResolverResult,
} from "../types/corporate";

let employees = [...employeesMock];

const wait = async (ms = 180) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function getCorporateAccount() {
  await wait();
  return corporateAccountMock;
}

export async function getEmployees(): Promise<CorporatePatient[]> {
  await wait();
  return [...employees];
}

export async function resolveVivelyUserByEmail(email: string): Promise<VivelyEmailResolverResult> {
  await wait();
  const existing = employees.find((employee) => employee.email.toLowerCase() === email.toLowerCase());
  if (existing?.signup_match_status === "found") {
    return {
      exists: true,
      vively_user_id: existing.vively_user_id,
      vively_patient_id: existing.vively_patient_id,
      userable_type: "Patient",
      link_status: "patient_linked",
    };
  }

  return {
    exists: false,
    vively_user_id: null,
    vively_patient_id: null,
    userable_type: null,
    link_status: "not_found",
  };
}

export async function createEmployeeInvite(input: CreateEmployeeInviteInput): Promise<CorporatePatient> {
  await wait();
  const resolver = await resolveVivelyUserByEmail(input.email);
  const newEmployee: CorporatePatient = {
    id: Math.max(...employees.map((employee) => employee.id)) + 1,
    corporate_account_id: corporateAccountMock.id,
    email: input.email,
    full_name: input.full_name,
    team_name: input.team_name,
    has_medicare: input.has_medicare,
    invite_token: `inv_${crypto.randomUUID().slice(0, 8)}`,
    invite_status: "invited",
    signup_match_status: resolver.exists ? "found" : "not_found",
    vively_user_id: resolver.vively_user_id,
    vively_patient_id: resolver.vively_patient_id,
    membership_status: "inactive",
    baseline_status: "not_started",
    invited_at: new Date().toISOString(),
    opened_at: null,
    signedup_at: null,
  };
  employees = [newEmployee, ...employees];
  return newEmployee;
}

export async function getActivationSummary(): Promise<ActivationSummary> {
  await wait();
  const total = employees.length;
  const opened = employees.filter((employee) => employee.opened_at).length;
  const continued = employees.filter((employee) => employee.invite_status === "continued_to_vively").length;
  const linked = employees.filter((employee) => employee.signup_match_status === "found").length;
  const baseline = employees.filter((employee) => employee.baseline_status === "completed").length;
  const active = employees.filter((employee) => employee.membership_status === "active").length;

  return {
    total_invited: total,
    opened_invites: opened,
    continued_to_vively: continued,
    linked_employees: linked,
    baseline_completed: baseline,
    active_memberships: active,
    activation_rate: Math.round((continued / total) * 100),
    baseline_completion_rate: Math.round((baseline / total) * 100),
    membership_rate: Math.round((active / total) * 100),
    funnel: [
      { stage: "Invited", count: total },
      { stage: "Opened", count: opened },
      { stage: "Continued", count: continued },
      { stage: "Linked", count: linked },
      { stage: "Baseline", count: baseline },
    ],
  };
}

export async function getHealthMetrics(team = "All Teams"): Promise<HealthMetricCohort> {
  await wait();
  return healthMetricsMock.find((metric) => metric.team === team) ?? healthMetricsMock[0];
}

export async function getBillingSummary(): Promise<BillingSummary> {
  await wait();
  const current = billingChargesMock[0];
  return {
    account: corporateAccountMock,
    current_period: current.period,
    employee_count: current.employee_count,
    current_amount_cents: current.amount_cents,
    current_status: current.status,
    history: billingChargesMock,
  };
}
