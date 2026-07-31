export type InviteStatus = "invited" | "opened" | "continued_to_vively";
export type SignupMatchStatus = "not_found" | "found";
export type MembershipStatus = "inactive" | "active";
export type BaselineStatus = "not_started" | "booked" | "completed";
export type ChargeType = "annual_membership" | "test_surcharge";
export type ChargeStatus = "charged" | "pending" | "failed";
export type HealthTrend = "up" | "flat" | "down";

export interface ApiEnvelope<T> {
  data: T;
}

export interface AuthSession {
  access_token: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  userable_type: string;
  userable_id: number;
}

export interface PrimaryAdmin {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Company {
  id: number;
  company_name: string;
  invite_code: string;
  plan_price_cents: number;
  primary_admin: PrimaryAdmin;
  created_at: string;
}

export interface CorporateTeam {
  id: number;
  name: string;
  member_count: number;
  created_at: string;
}

export interface CorporateMember {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  team: CorporateTeam;
  has_medicare: boolean;
  invite_status: InviteStatus;
  signup_match_status: SignupMatchStatus;
  membership_status: MembershipStatus;
  baseline_status: BaselineStatus;
  invited_at: string;
  email_sent_at: string | null;
  opened_at: string | null;
  signedup_at: string | null;
  removed_at: string | null;
  created_at: string;
}

export interface CreateMemberInviteInput {
  email: string;
  first_name: string;
  last_name: string;
  has_medicare: boolean;
}

export interface ActivationSummary {
  total_members: number;
  funnel: {
    invited: number;
    opened: number;
    continued_to_vively: number;
    active: number;
    baseline_completed: number;
  };
  activation_rate: number;
}

export interface HealthCategory {
  name: string;
  average_score: number;
  trend: HealthTrend;
  optimal: number;
  in_range: number;
  needs_attention: number;
}

export interface HealthMetrics {
  scope: "company" | "team";
  team: CorporateTeam | null;
  cohort_size: number;
  below_privacy_threshold: boolean;
  categories: HealthCategory[] | null;
}

export interface BillingCharge {
  id: number;
  period: string;
  amount_cents: number;
  employee_count: number;
  charge_type: ChargeType;
  status: ChargeStatus;
  charged_at: string | null;
  created_at: string;
}

export interface BillingSummary {
  current_period: string;
  annual_membership: {
    amount_cents: number;
    employee_count: number;
    status: ChargeStatus;
    charged_at: string | null;
  };
  charges: BillingCharge[];
}
