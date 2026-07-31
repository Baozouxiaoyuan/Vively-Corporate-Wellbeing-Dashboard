# API Contract

This prototype now follows Anton's target API shape directly. The frontend model is aligned with the target backend contract rather than an older local route shape.

The app can still run in two modes:

- `npm run dev` uses local mock functions in `src/api/mockApi.ts`.
- `npm run dev:backend` uses the FastAPI prototype through `src/api/backendApi.ts`.

Both modes return the same frontend-facing data shape:

- base path: `/v2`
- company routes: `/v2/companies/{company}/...`
- response wrapper: `{ data: ... }`
- field naming: `snake_case`
- people are called `members`
- team data is a nested object on each member

## Privacy Rule

Health data shown to corporate admins must stay aggregate-only.

- Do not show patient IDs in the UI.
- Do not show raw Vively user IDs, patient IDs, invite tokens, biomarker rows, blood tests, or per-person health scores.
- Backend health endpoints enforce the cohort threshold before returning category data.
- Below-threshold health responses return `below_privacy_threshold: true` and `categories: null`.

## Frontend Calls

### `login(email, password)`

Maps to:

```text
POST /v2/login
```

Returns:

```ts
{
  access_token: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  userable_type: string;
  userable_id: number;
}
```

### `getCompany()`

Maps to:

```text
GET /v2/companies/{company}
```

Returns company profile data:

```ts
{
  id: number;
  company_name: string;
  invite_code: string;
  plan_price_cents: number;
  primary_admin: {
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
}
```

### `getMembers()`

Maps to:

```text
GET /v2/companies/{company}/members
```

Returns operational member data only:

```ts
{
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  team: {
    id: number;
    name: string;
    member_count: number;
    created_at: string;
  };
  has_medicare: boolean;
  invite_status: "invited" | "opened" | "continued_to_vively";
  signup_match_status: "not_found" | "found";
  membership_status: "inactive" | "active";
  baseline_status: "not_started" | "booked" | "completed";
  invited_at: string;
  email_sent_at: string | null;
  opened_at: string | null;
  signedup_at: string | null;
  removed_at: string | null;
  created_at: string;
}
```

### `getTeams()`, `createTeam()`, `renameTeam()`, `deleteTeam()`

Maps to:

```text
GET    /v2/companies/{company}/teams
POST   /v2/companies/{company}/teams
PATCH  /v2/companies/{company}/teams/{team}
DELETE /v2/companies/{company}/teams/{team}
```

Team delete returns `204` when successful. If a team still has members, the backend returns `422`.

### `createMemberInvite(teamId, input)`

Maps to:

```text
POST /v2/companies/{company}/teams/{team}/members
```

Input:

```ts
{
  email: string;
  first_name: string;
  last_name: string;
  has_medicare: boolean;
}
```

Returns the created member record.

### `sendMemberInvitation(memberId)`

Maps to:

```text
POST /v2/companies/{company}/members/{member}/invitation
```

Used for both first send and resend. Returns the updated member record with `email_sent_at`.

### `deleteMember(memberId)`

Maps to:

```text
DELETE /v2/companies/{company}/members/{member}
```

This removes the member from the corporate dashboard list only. It does not delete a Vively user, patient profile, health record, or billing history.

### `getActivationSummary()`

Maps to:

```text
GET /v2/companies/{company}/activation-summary
```

Returns:

```ts
{
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
```

`activation_rate` is a decimal, for example `0.72`.

### `getCompanyHealthMetrics()`

Maps to:

```text
GET /v2/companies/{company}/health-metrics
```

### `getTeamHealthMetrics(teamId)`

Maps to:

```text
GET /v2/companies/{company}/teams/{team}/health-metrics
```

Returns:

```ts
{
  scope: "company" | "team";
  team: null | {
    id: number;
    name: string;
    member_count: number;
    created_at: string;
  };
  cohort_size: number;
  below_privacy_threshold: boolean;
  categories: null | Array<{
    name: string;
    average_score: number;
    trend: "up" | "flat" | "down";
    optimal: number;
    in_range: number;
    needs_attention: number;
  }>;
}
```

Anton confirmed that extra health-matrix attributes can use the same `snake_case` convention, so `optimal`, `in_range` and `needs_attention` are included.

### `getBilling()`

Maps to:

```text
GET /v2/companies/{company}/billing
```

Returns:

```ts
{
  current_period: string;
  annual_membership: {
    amount_cents: number;
    employee_count: number;
    status: "charged" | "pending" | "failed";
    charged_at: string | null;
  };
  charges: Array<{
    id: number;
    period: string;
    amount_cents: number;
    employee_count: number;
    charge_type: "annual_membership" | "test_surcharge";
    status: "charged" | "pending" | "failed";
    charged_at: string | null;
    created_at: string;
  }>;
}
```
