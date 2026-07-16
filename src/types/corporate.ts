export type InviteStatus = "invited" | "opened" | "continued_to_vively";
export type SignupMatchStatus = "not_found" | "found";
export type MembershipStatus = "inactive" | "active";
export type BaselineStatus = "not_started" | "booked" | "completed";
export type ChargeType = "enrollment" | "test_surcharge" | "monthly_subscription";
export type ChargeStatus = "charged" | "pending" | "failed";

export interface CorporateAccount {
  id: number;
  company_name: string;
  invite_code: string;
  plan_price_cents: number;
  admin_name: string;
  admin_email: string;
}

export interface CorporatePatient {
  id: number;
  corporate_account_id: number;
  email: string;
  full_name: string;
  team_name: string;
  has_medicare: boolean;
  invite_token: string;
  invite_status: InviteStatus;
  signup_match_status: SignupMatchStatus;
  vively_user_id: number | null;
  vively_patient_id: number | null;
  membership_status: MembershipStatus;
  baseline_status: BaselineStatus;
  invited_at: string;
  email_sent_at?: string | null;
  opened_at: string | null;
  signedup_at: string | null;
}

export interface BillingCharge {
  id: number;
  corporate_account_id: number;
  period: string;
  amount_cents: number;
  employee_count: number;
  charge_type: ChargeType;
  status: ChargeStatus;
  charged_at: string | null;
}

export interface CreateEmployeeInviteInput {
  email: string;
  full_name: string;
  team_name: string;
  has_medicare: boolean;
}

export interface VivelyEmailResolverResult {
  exists: boolean;
  vively_user_id: number | null;
  vively_patient_id: number | null;
  userable_type: "Patient" | null;
  link_status: "patient_linked" | "not_found";
}

export interface ActivationSummary {
  total_invited: number;
  opened_invites: number;
  continued_to_vively: number;
  linked_employees: number;
  baseline_completed: number;
  active_memberships: number;
  activation_rate: number;
  baseline_completion_rate: number;
  membership_rate: number;
  funnel: Array<{ stage: string; count: number }>;
}

export interface HealthMetricCohort {
  team: string;
  cohort_size: number;
  optimal_biomarker_percentage: number;
  in_range_biomarker_percentage: number;
  needs_attention_percentage: number;
  category_distribution: Array<{ category: string; optimal: number; in_range: number; needs_attention: number }>;
}

export interface BillingSummary {
  account: CorporateAccount;
  current_period: string;
  employee_count: number;
  current_amount_cents: number;
  current_status: ChargeStatus;
  history: BillingCharge[];
}
