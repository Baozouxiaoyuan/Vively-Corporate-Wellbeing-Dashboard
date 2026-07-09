# Vively Corporate Dashboard Mock API Specification

This document describes every mock API currently used by the Vively Corporate Wellbeing Dashboard prototype.

The current frontend implementation lives in:

- `src/api/mockApi.ts`
- `src/types/corporate.ts`
- `src/data/*.mock.ts`

The prototype does not call real Vively production APIs yet. These mock functions are written to look like future replaceable API calls. Vively could later implement equivalent backend routes and the frontend can swap `mockApi.ts` internals without rewriting page components.

## Important Privacy Rules

The dashboard must never expose individual health records.

Allowed:

- Corporate workflow data such as invite status, signup linkage status, membership status and baseline completion status.
- Anonymised aggregate health metrics.
- Team-level aggregate percentages only when the cohort meets the privacy threshold.

Not allowed:

- Individual biomarker rows.
- Individual blood test rows.
- Individual health score history.
- Patient IDs in the visible UI.
- Raw patient health values by person.

The current prototype uses a privacy threshold of `10` employees for health metrics. If a team has fewer than `10` people, the frontend shows `Insufficient Data`.

## Data Ownership Model

The prototype assumes this split:

| Data | Source of truth |
| --- | --- |
| Corporate account | Corporate dashboard backend |
| Corporate employee invite records | Corporate dashboard backend |
| Vively user matching by email | Vively backend |
| Vively user ID / patient ID references | Vively backend |
| Membership status | Vively backend or subscription system |
| Baseline health check status | Vively backend |
| Aggregated health metrics | Vively backend aggregation service |
| Billing summary/history | Corporate dashboard backend or billing service |

The corporate dashboard should store Vively IDs only as references. It should not store raw health data.

## Type Definitions

### CorporateAccount

```ts
interface CorporateAccount {
  id: number;
  company_name: string;
  invite_code: string;
  plan_price_cents: number;
  admin_name: string;
  admin_email: string;
}
```

Field details:

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `id` | number | `1` | Corporate account ID in dashboard system. |
| `company_name` | string | `"Commonwealth Bank"` | Display name for the employer. |
| `invite_code` | string | `"COMBANK-2026"` | Human-readable corporate invite code. |
| `plan_price_cents` | number | `7900` | Price in cents. `7900` means `$79.00`. |
| `admin_name` | string | `"Ruitao Yuan"` | Admin/HR user name. |
| `admin_email` | string | `"ryua7873@uni.sydney.edu.au"` | Admin/HR user email. |

### CorporatePatient

```ts
interface CorporatePatient {
  id: number;
  corporate_account_id: number;
  email: string;
  full_name: string;
  team_name: string;
  has_medicare: boolean;
  invite_token: string;
  invite_status: "invited" | "opened" | "continued_to_vively";
  signup_match_status: "not_found" | "found";
  vively_user_id: number | null;
  vively_patient_id: number | null;
  membership_status: "inactive" | "active";
  baseline_status: "not_started" | "booked" | "completed";
  invited_at: string;
  opened_at: string | null;
  signedup_at: string | null;
}
```

Field details:

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `id` | number | `1` | Corporate dashboard employee invite record ID. |
| `corporate_account_id` | number | `1` | Links employee invite to a corporate account. |
| `email` | string | `"ava.patel@northstar.example"` | Employee email used for invitation and Vively matching. |
| `full_name` | string | `"Ava Patel"` | Employee display name. |
| `team_name` | string | `"Operations"` | Team/cohort label for filtering and aggregate metrics. |
| `has_medicare` | boolean | `true` | Corporate workflow flag captured at invite time. |
| `invite_token` | string | `"inv_ava_patel"` | Token used for `/join/{invite_token}` style invite links. |
| `invite_status` | enum | `"opened"` | Invite progress state. |
| `signup_match_status` | enum | `"found"` | Whether this email matched a Vively user/patient. |
| `vively_user_id` | number/null | `5012` | Vively user reference. Should not be displayed in UI. |
| `vively_patient_id` | number/null | `8012` | Vively patient reference. Should not be displayed in UI. |
| `membership_status` | enum | `"active"` | Corporate/Vively membership state. |
| `baseline_status` | enum | `"completed"` | Baseline health check workflow state. |
| `invited_at` | ISO string | `"2026-06-03T09:00:00Z"` | Invite creation timestamp. |
| `opened_at` | ISO string/null | `"2026-06-03T10:15:00Z"` | First invite open timestamp. |
| `signedup_at` | ISO string/null | `"2026-06-04T08:20:00Z"` | Vively signup/continuation timestamp. |

### BillingCharge

```ts
interface BillingCharge {
  id: number;
  corporate_account_id: number;
  period: string;
  amount_cents: number;
  employee_count: number;
  charge_type: "enrollment" | "test_surcharge" | "monthly_subscription";
  status: "charged" | "pending" | "failed";
  charged_at: string | null;
}
```

Field details:

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `id` | number | `1` | Billing charge ID. |
| `corporate_account_id` | number | `1` | Corporate account being charged. |
| `period` | string | `"July 2026"` | Billing period display label. |
| `amount_cents` | number | `94800` | Amount in cents. |
| `employee_count` | number | `12` | Employee count used for this charge. |
| `charge_type` | enum | `"monthly_subscription"` | Charge category. |
| `status` | enum | `"pending"` | Charge status. |
| `charged_at` | ISO string/null | `null` | Null when not charged yet. |

### ActivationSummary

```ts
interface ActivationSummary {
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
```

Computed logic:

| Field | Logic |
| --- | --- |
| `total_invited` | Total number of corporate employee invite records. |
| `opened_invites` | Employees where `opened_at !== null`. |
| `continued_to_vively` | Employees where `invite_status === "continued_to_vively"`. |
| `linked_employees` | Employees where `signup_match_status === "found"`. |
| `baseline_completed` | Employees where `baseline_status === "completed"`. |
| `active_memberships` | Employees where `membership_status === "active"`. |
| `activation_rate` | `round(continued_to_vively / total_invited * 100)`. |
| `baseline_completion_rate` | `round(baseline_completed / total_invited * 100)`. |
| `membership_rate` | `round(active_memberships / total_invited * 100)`. |

### HealthMetricCohort

```ts
interface HealthMetricCohort {
  team: string;
  cohort_size: number;
  average_vively_score: number;
  score_change: number;
  optimal_biomarker_percentage: number;
  in_range_biomarker_percentage: number;
  needs_attention_percentage: number;
  category_distribution: Array<{
    category: string;
    optimal: number;
    in_range: number;
    needs_attention: number;
  }>;
  trend: Array<{ month: string; score: number }>;
}
```

Field details:

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `team` | string | `"All Teams"` | Cohort/team name. |
| `cohort_size` | number | `34` | Number of employees included in aggregate. |
| `average_vively_score` | number | `78` | Aggregate average score. |
| `score_change` | number | `6` | Change versus previous comparison period. |
| `optimal_biomarker_percentage` | number | `54` | Whole-cohort aggregate percentage. |
| `in_range_biomarker_percentage` | number | `31` | Whole-cohort aggregate percentage. |
| `needs_attention_percentage` | number | `15` | Whole-cohort aggregate percentage. |
| `category_distribution` | array | See examples | Aggregate category percentages only. |
| `trend` | array | See examples | Aggregate trend only. |

For each category, `optimal + in_range + needs_attention` should equal `100`.

## Mock API Functions and Suggested Real Routes

The current frontend uses functions. Vively may implement equivalent REST routes or GraphQL fields later.

## 1. Get Corporate Account

Current mock function:

```ts
getCorporateAccount(): Promise<CorporateAccount>
```

Suggested REST route:

```http
GET /api/corporate/account
```

Purpose:

Returns the current admin user's corporate account.

Request:

No body.

Example response:

```json
{
  "id": 1,
  "company_name": "Commonwealth Bank",
  "invite_code": "COMBANK-2026",
  "plan_price_cents": 7900,
  "admin_name": "Ruitao Yuan",
  "admin_email": "ryua7873@uni.sydney.edu.au"
}
```

Possible backend notes:

- In production, the account should be resolved from the authenticated admin session.
- The frontend should not pass `corporate_account_id` manually for this route unless the admin can manage multiple accounts.

## 2. Get Employees

Current mock function:

```ts
getEmployees(): Promise<CorporatePatient[]>
```

Suggested REST route:

```http
GET /api/corporate/employees
```

Purpose:

Returns corporate employee invite/progress records.

Request:

No body in the current prototype.

Recommended future query parameters:

```http
GET /api/corporate/employees?team=Operations&invite_status=opened&search=ava
```

Future query parameter ideas:

| Parameter | Type | Example | Notes |
| --- | --- | --- | --- |
| `team` | string | `"Operations"` | Optional team filter. |
| `invite_status` | enum | `"opened"` | Optional invite status filter. |
| `membership_status` | enum | `"active"` | Optional membership filter. |
| `baseline_status` | enum | `"completed"` | Optional baseline filter. |
| `search` | string | `"ava"` | Search by name or email. |
| `page` | number | `1` | Future pagination. |
| `page_size` | number | `25` | Future pagination. |

Example response:

```json
[
  {
    "id": 1,
    "corporate_account_id": 1,
    "email": "ava.patel@northstar.example",
    "full_name": "Ava Patel",
    "team_name": "Operations",
    "has_medicare": true,
    "invite_token": "inv_ava_patel",
    "invite_status": "continued_to_vively",
    "signup_match_status": "found",
    "vively_user_id": 5012,
    "vively_patient_id": 8012,
    "membership_status": "active",
    "baseline_status": "completed",
    "invited_at": "2026-06-03T09:00:00Z",
    "opened_at": "2026-06-03T10:15:00Z",
    "signedup_at": "2026-06-04T08:20:00Z"
  },
  {
    "id": 2,
    "corporate_account_id": 1,
    "email": "leo.martin@northstar.example",
    "full_name": "Leo Martin",
    "team_name": "Operations",
    "has_medicare": false,
    "invite_token": "inv_leo_martin",
    "invite_status": "opened",
    "signup_match_status": "not_found",
    "vively_user_id": null,
    "vively_patient_id": null,
    "membership_status": "inactive",
    "baseline_status": "booked",
    "invited_at": "2026-06-04T09:00:00Z",
    "opened_at": "2026-06-05T11:30:00Z",
    "signedup_at": null
  }
]
```

Important UI privacy note:

The frontend currently receives `vively_user_id` and `vively_patient_id` because the prototype stores references, but it does not display these IDs. Production API design could either:

- Include these IDs only for internal/admin systems, or
- Hide them from this frontend and expose only `signup_match_status`.

## 3. Create Employee Invite

Current mock function:

```ts
createEmployeeInvite(input: CreateEmployeeInviteInput): Promise<CorporatePatient>
```

Suggested REST route:

```http
POST /api/corporate/employees/invites
```

Purpose:

Creates a new corporate employee invite record.

Request body:

```json
{
  "email": "new.employee@example.com",
  "full_name": "New Employee",
  "team_name": "Operations",
  "has_medicare": true
}
```

Request field details:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `email` | string | Yes | Employee email. Should be unique within corporate account. |
| `full_name` | string | Yes | Employee display name. |
| `team_name` | string | Yes | Team/cohort label. |
| `has_medicare` | boolean | Yes | Captured as corporate onboarding metadata. |

Current mock creation logic:

```ts
{
  id: nextEmployeeId,
  corporate_account_id: currentCorporateAccount.id,
  email: input.email,
  full_name: input.full_name,
  team_name: input.team_name,
  has_medicare: input.has_medicare,
  invite_token: `inv_${randomId}`,
  invite_status: "invited",
  signup_match_status: resolver.exists ? "found" : "not_found",
  vively_user_id: resolver.vively_user_id,
  vively_patient_id: resolver.vively_patient_id,
  membership_status: "inactive",
  baseline_status: "not_started",
  invited_at: now,
  opened_at: null,
  signedup_at: null
}
```

Example response:

```json
{
  "id": 13,
  "corporate_account_id": 1,
  "email": "new.employee@example.com",
  "full_name": "New Employee",
  "team_name": "Operations",
  "has_medicare": true,
  "invite_token": "inv_a1b2c3d4",
  "invite_status": "invited",
  "signup_match_status": "not_found",
  "vively_user_id": null,
  "vively_patient_id": null,
  "membership_status": "inactive",
  "baseline_status": "not_started",
  "invited_at": "2026-07-06T01:15:00.000Z",
  "opened_at": null,
  "signedup_at": null
}
```

Recommended production validation:

| Case | Suggested response |
| --- | --- |
| Invalid email | `400 Bad Request` |
| Missing required field | `400 Bad Request` |
| Duplicate employee email in same corporate account | `409 Conflict` |
| Unauthenticated admin | `401 Unauthorized` |
| Admin does not belong to account | `403 Forbidden` |

## 4. Resolve Vively User by Email

Current mock function:

```ts
resolveVivelyUserByEmail(email: string): Promise<VivelyEmailResolverResult>
```

Suggested REST route:

```http
POST /api/vively/users/resolve-by-email
```

or, if scoped to the corporate dashboard:

```http
POST /api/corporate/vively/resolve-user
```

Purpose:

Simulates the missing Vively email resolver route. The corporate dashboard needs to know whether an invited employee email already maps to a Vively user/patient.

Request body:

```json
{
  "email": "ava.patel@northstar.example"
}
```

Response when found:

```json
{
  "exists": true,
  "vively_user_id": 5012,
  "vively_patient_id": 8012,
  "userable_type": "Patient",
  "link_status": "patient_linked"
}
```

Response when not found:

```json
{
  "exists": false,
  "vively_user_id": null,
  "vively_patient_id": null,
  "userable_type": null,
  "link_status": "not_found"
}
```

Field details:

| Field | Type | Notes |
| --- | --- | --- |
| `exists` | boolean | Whether a matching Vively user exists. |
| `vively_user_id` | number/null | Vively user reference if found. |
| `vively_patient_id` | number/null | Vively patient reference if found. |
| `userable_type` | `"Patient"`/null | Current prototype assumes employee maps to a patient user. |
| `link_status` | enum | `"patient_linked"` or `"not_found"`. |

Security note:

This route can reveal whether an email exists in Vively. In production, it should be protected and rate limited. It should only be callable by authorised corporate admins or internal services.

## 5. Get Activation Summary

Current mock function:

```ts
getActivationSummary(): Promise<ActivationSummary>
```

Suggested REST route:

```http
GET /api/corporate/activation/summary
```

Purpose:

Returns corporate invite and activation funnel metrics.

Request:

No body in the current prototype.

Recommended future query parameters:

```http
GET /api/corporate/activation/summary?team=Engineering&period=2026-07
```

Example response:

```json
{
  "total_invited": 12,
  "opened_invites": 9,
  "continued_to_vively": 7,
  "linked_employees": 7,
  "baseline_completed": 6,
  "active_memberships": 6,
  "activation_rate": 58,
  "baseline_completion_rate": 50,
  "membership_rate": 50,
  "funnel": [
    { "stage": "Invited", "count": 12 },
    { "stage": "Opened", "count": 9 },
    { "stage": "Continued", "count": 7 },
    { "stage": "Linked", "count": 7 },
    { "stage": "Baseline", "count": 6 }
  ]
}
```

Backend computation requirements:

- `total_invited` should count all employee invite records for the corporate account.
- `opened_invites` should count invites with an open event.
- `continued_to_vively` should count invite records that continued into the Vively signup/onboarding flow.
- `linked_employees` should count records linked to a Vively user/patient.
- `baseline_completed` should count linked employees with completed baseline status.
- `active_memberships` should count active memberships.

## 6. Get Health Metrics

Current mock function:

```ts
getHealthMetrics(team?: string): Promise<HealthMetricCohort>
```

Suggested REST route:

```http
GET /api/corporate/health-metrics?team=All%20Teams
```

Purpose:

Returns anonymised aggregate health metrics for the selected team/cohort.

Request query parameters:

| Parameter | Type | Required | Example | Notes |
| --- | --- | --- | --- | --- |
| `team` | string | No | `"Operations"` | Defaults to `"All Teams"`. |

Recommended future query parameters:

| Parameter | Type | Example | Notes |
| --- | --- | --- | --- |
| `period` | string | `"2026-Q2"` | Reporting period. |
| `comparison_period` | string | `"previous_period"` | For `score_change`. |
| `privacy_threshold` | number | `10` | Usually backend-controlled. |

Example response for a cohort above threshold:

```json
{
  "team": "All Teams",
  "cohort_size": 34,
  "average_vively_score": 78,
  "score_change": 6,
  "optimal_biomarker_percentage": 54,
  "in_range_biomarker_percentage": 31,
  "needs_attention_percentage": 15,
  "category_distribution": [
    { "category": "Aging", "optimal": 57, "in_range": 30, "needs_attention": 13 },
    { "category": "Metabolic", "optimal": 56, "in_range": 31, "needs_attention": 13 },
    { "category": "Heart", "optimal": 61, "in_range": 28, "needs_attention": 11 },
    { "category": "Liver", "optimal": 68, "in_range": 24, "needs_attention": 8 },
    { "category": "Nutrients", "optimal": 44, "in_range": 38, "needs_attention": 18 },
    { "category": "Kidney", "optimal": 72, "in_range": 22, "needs_attention": 6 },
    { "category": "Hormones", "optimal": 49, "in_range": 34, "needs_attention": 17 },
    { "category": "Immunity", "optimal": 63, "in_range": 29, "needs_attention": 8 },
    { "category": "Inflammation", "optimal": 52, "in_range": 30, "needs_attention": 18 },
    { "category": "Blood", "optimal": 66, "in_range": 27, "needs_attention": 7 }
  ],
  "trend": [
    { "month": "Feb", "score": 71 },
    { "month": "Mar", "score": 72 },
    { "month": "Apr", "score": 74 },
    { "month": "May", "score": 76 },
    { "month": "Jun", "score": 78 }
  ]
}
```

Current mock response for a cohort below threshold:

```json
{
  "team": "Sales",
  "cohort_size": 7,
  "average_vively_score": 73,
  "score_change": 3,
  "optimal_biomarker_percentage": 44,
  "in_range_biomarker_percentage": 36,
  "needs_attention_percentage": 20,
  "category_distribution": [],
  "trend": []
}
```

Recommended production response for a cohort below threshold:

```json
{
  "team": "Sales",
  "cohort_size": 7,
  "privacy_threshold": 10,
  "is_suppressed": true,
  "suppression_reason": "INSUFFICIENT_COHORT_SIZE",
  "average_vively_score": null,
  "score_change": null,
  "optimal_biomarker_percentage": null,
  "in_range_biomarker_percentage": null,
  "needs_attention_percentage": null,
  "category_distribution": [],
  "trend": []
}
```

Recommended backend privacy rules:

- Backend should enforce suppression, not only frontend.
- If `cohort_size < privacy_threshold`, do not return hidden aggregate metrics.
- Do not return individual patient IDs, names, emails, biomarker rows, blood test rows or raw values.
- For small teams, include only metadata required for UI messaging, such as `team`, `cohort_size`, `privacy_threshold` and `is_suppressed`.

## 7. Get Billing Summary

Current mock function:

```ts
getBillingSummary(): Promise<BillingSummary>
```

Suggested REST route:

```http
GET /api/corporate/billing/summary
```

Purpose:

Returns the current billing period and billing history for the corporate account.

Request:

No body in the current prototype.

Example response:

```json
{
  "account": {
    "id": 1,
    "company_name": "Commonwealth Bank",
    "invite_code": "COMBANK-2026",
    "plan_price_cents": 7900,
    "admin_name": "Ruitao Yuan",
    "admin_email": "ryua7873@uni.sydney.edu.au"
  },
  "current_period": "July 2026",
  "employee_count": 12,
  "current_amount_cents": 94800,
  "current_status": "pending",
  "history": [
    {
      "id": 1,
      "corporate_account_id": 1,
      "period": "July 2026",
      "amount_cents": 94800,
      "employee_count": 12,
      "charge_type": "monthly_subscription",
      "status": "pending",
      "charged_at": null
    },
    {
      "id": 2,
      "corporate_account_id": 1,
      "period": "June 2026",
      "amount_cents": 79000,
      "employee_count": 10,
      "charge_type": "monthly_subscription",
      "status": "charged",
      "charged_at": "2026-06-30T23:30:00Z"
    },
    {
      "id": 3,
      "corporate_account_id": 1,
      "period": "June 2026",
      "amount_cents": 18000,
      "employee_count": 6,
      "charge_type": "test_surcharge",
      "status": "charged",
      "charged_at": "2026-06-18T03:10:00Z"
    }
  ]
}
```

Important prototype constraint:

This is mock billing only. The prototype should not integrate real Stripe, store payment methods or perform real payment actions.

Recommended future billing routes:

```http
GET /api/corporate/billing/summary
GET /api/corporate/billing/charges
GET /api/corporate/billing/invoices/:invoice_id
```

## Current Mock Data Summary

### Corporate account

```json
{
  "id": 1,
  "company_name": "Commonwealth Bank",
  "invite_code": "COMBANK-2026",
  "plan_price_cents": 7900,
  "admin_name": "Ruitao Yuan",
  "admin_email": "ryua7873@uni.sydney.edu.au"
}
```

### Teams currently represented

```txt
Operations
People
Sales
Engineering
```

### Health metric cohorts currently represented

```txt
All Teams: cohort_size 34
Operations: cohort_size 12
Engineering: cohort_size 11
Sales: cohort_size 7
People: cohort_size 4
```

### Privacy-threshold behavior

| Team | Cohort size | Should show metrics? |
| --- | ---: | --- |
| All Teams | 34 | Yes |
| Operations | 12 | Yes |
| Engineering | 11 | Yes |
| Sales | 7 | No |
| People | 4 | No |

## Suggested API Implementation Priority for Vively

If Vively implements real routes gradually, the recommended order is:

1. `GET /api/corporate/account`
2. `GET /api/corporate/employees`
3. `POST /api/corporate/employees/invites`
4. `POST /api/corporate/vively/resolve-user`
5. `GET /api/corporate/activation/summary`
6. `GET /api/corporate/health-metrics`
7. `GET /api/corporate/billing/summary`

The highest-risk route is health metrics because privacy suppression must be enforced on the backend.

## Current Frontend Replacement Plan

When real APIs exist, update only `src/api/mockApi.ts`.

Example:

```ts
export async function getEmployees(): Promise<CorporatePatient[]> {
  const response = await fetch("/api/corporate/employees");
  if (!response.ok) throw new Error("Failed to load employees");
  return response.json();
}
```

The page components should not need major changes if the response shapes match this document.

