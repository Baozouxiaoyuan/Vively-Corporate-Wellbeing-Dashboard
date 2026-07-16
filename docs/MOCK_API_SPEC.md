# Mock API Contract

This prototype does not call the real Vively API yet. The frontend calls local functions in `src/api/mockApi.ts` so the pages can be built against a clear API shape and later swapped to real backend calls.

## Privacy Rule

Health data shown to corporate admins must stay aggregate-only.

- Do not show patient IDs in the UI.
- Do not show individual biomarkers, blood tests, or per-person health scores.
- Hide health metrics when the selected cohort is below `productConfig.privacyThreshold`.

## Current Frontend Calls

### `getCorporateAccount()`

Used by Dashboard and Billing.

Returns:

```ts
{
  id: number;
  company_name: string;
  invite_code: string;
  plan_price_cents: number;
  admin_name: string;
  admin_email: string;
}
```

### `getEmployees()`

Used by Employees & Activation.

Returns an array of corporate employee records:

```ts
{
  id: number;
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
  email_sent_at?: string | null;
  opened_at: string | null;
  signedup_at: string | null;
}
```

### `createEmployeeInvite(input)`

Used when an admin invites an employee.

Input:

```ts
{
  email: string;
  full_name: string;
  team_name: string;
  has_medicare: boolean;
}
```

Returns the created employee record.

### `resolveVivelyUserByEmail(email)`

Internal mock helper used by `createEmployeeInvite`.

Returns whether the email maps to an existing Vively user/patient reference:

```ts
{
  exists: boolean;
  vively_user_id: number | null;
  vively_patient_id: number | null;
  userable_type: "Patient" | null;
  link_status: "patient_linked" | "not_found";
}
```

### `sendEmployeeInviteEmail(employeeId)`

Prototype-only mock for the email invite action.

Returns the updated employee record with `email_sent_at` set.

### `removeEmployee(employeeId)`

Prototype-only mock for removing an employee from the corporate list.

This does not delete a Vively user, patient profile, health record, or billing history.

### `getActivationSummary()`

Used by Dashboard and Employees & Activation.

Returns:

```ts
{
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

### `getHealthMetrics(team)`

Used by Dashboard and Health Metrics.

Returns aggregate-only team health data:

```ts
{
  team: string;
  cohort_size: number;
  optimal_biomarker_percentage: number;
  in_range_biomarker_percentage: number;
  needs_attention_percentage: number;
  category_distribution: Array<{
    category: string;
    optimal: number;
    in_range: number;
    needs_attention: number;
  }>;
}
```

### `getBillingSummary()`

Used by Dashboard and Billing.

Returns current billing summary plus charge history.

## Likely Vively Support Needed

For real integration, the main missing pieces are:

- A safe way to resolve employee email to Vively `user_id` / `patient_id`.
- Consent or permission status for using employee data in corporate aggregates.
- Backend aggregate health metrics with the privacy threshold enforced server-side.
- Real invitation email sending.
- Real corporate billing rules, if billing becomes functional.
