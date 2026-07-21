from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


InviteStatus = Literal["invited", "opened", "continued_to_vively"]
SignupMatchStatus = Literal["not_found", "found"]
MembershipStatus = Literal["inactive", "active"]
BaselineStatus = Literal["not_started", "booked", "completed"]
ChargeType = Literal["annual_membership", "test_surcharge"]
ChargeStatus = Literal["charged", "pending", "failed"]


class CorporateAccount(BaseModel):
    id: int
    company_name: str
    invite_code: str
    plan_price_cents: int
    admin_name: str
    admin_email: str


class CorporateEmployee(BaseModel):
    id: int
    corporate_account_id: int
    email: str
    full_name: str
    team_name: str
    has_medicare: bool
    invite_token: str
    invite_status: InviteStatus
    signup_match_status: SignupMatchStatus
    vively_user_id: int | None
    vively_patient_id: int | None
    membership_status: MembershipStatus
    baseline_status: BaselineStatus
    invited_at: str
    email_sent_at: str | None = None
    opened_at: str | None
    signedup_at: str | None


class CreateEmployeeInviteInput(BaseModel):
    email: str
    full_name: str
    team_name: str
    has_medicare: bool = True


class VivelyEmailResolverResult(BaseModel):
    exists: bool
    vively_user_id: int | None
    vively_patient_id: int | None
    userable_type: Literal["Patient"] | None
    link_status: Literal["patient_linked", "not_found"]


class FunnelStage(BaseModel):
    stage: str
    count: int


class ActivationSummary(BaseModel):
    total_invited: int
    opened_invites: int
    continued_to_vively: int
    linked_employees: int
    baseline_completed: int
    active_memberships: int
    activation_rate: int
    baseline_completion_rate: int
    membership_rate: int
    funnel: list[FunnelStage]


class HealthCategory(BaseModel):
    category: str
    optimal: int
    in_range: int
    needs_attention: int


class HealthMetricCohort(BaseModel):
    team: str
    cohort_size: int
    optimal_biomarker_percentage: int
    in_range_biomarker_percentage: int
    needs_attention_percentage: int
    category_distribution: list[HealthCategory]


class BillingCharge(BaseModel):
    id: int
    corporate_account_id: int
    period: str
    amount_cents: int
    employee_count: int
    charge_type: ChargeType
    status: ChargeStatus
    charged_at: str | None


class BillingSummary(BaseModel):
    account: CorporateAccount
    current_period: str
    employee_count: int
    current_amount_cents: int
    current_status: ChargeStatus
    history: list[BillingCharge]


class DeleteResult(BaseModel):
    ok: bool
