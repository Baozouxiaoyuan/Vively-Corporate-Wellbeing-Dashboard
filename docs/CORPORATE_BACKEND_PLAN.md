# Corporate Backend Plan

## Goal

Build a small corporate dashboard backend that can later fit into Vively's codebase or database without changing the frontend contract too much.

The backend should own corporate workflow data and expose dashboard-friendly APIs. It should not expose individual patient health records to corporate admins.

## Why We Need Our Own Layer

The Vively API already has patient-focused endpoints such as:

- `/patients/{patient}/aggregate/vively-score`
- `/patients/{patient}/biomarker-values`
- `/patients/{patient}/blood-tests`
- `/patients/{patient}/health-score-groups`

Those are useful for Vively's app, but they are not safe to call directly from a corporate admin dashboard. The corporate dashboard needs de-identified team-level data.

So the proposed architecture is:

```text
Frontend
  -> Corporate dashboard backend
    -> Vively API / Vively database
```

## Our Backend Owns

- Corporate account details
- Corporate admin users and roles
- Employee invite records
- Team labels
- Invite email delivery status
- Activation summary calculations
- Billing summary display data

## Vively Support Needed

- Resolve employee email to Vively `users.id` and `patients.id`
- Confirm whether the employee has consented to aggregate corporate reporting
- Provide membership status
- Provide baseline completion status
- Provide or support calculation of aggregate biomarker categories
- Provide Vively score and benchmark comparison calculations
- Confirm the official privacy threshold

## Database Alignment

The proposed schema in `backend/corporate-schema.sql` follows Vively's MySQL style:

- `BIGINT UNSIGNED` primary keys
- `created_at` and `updated_at` timestamps
- enum fields for simple statuses
- nullable Vively references:
  - `vively_user_id`
  - `vively_patient_id`

These references match Vively's existing `users.id` and `patients.id`. They are stored only on the backend for linking and aggregation. The frontend does not display them.

Health metrics are not stored in the corporate schema for the MVP. The backend endpoint should fetch or calculate aggregate health data from Vively-owned data, then return only the safe aggregate response to the frontend.

## Privacy Rule

The backend should enforce privacy before returning health data.

Corporate admins can see:

- cohort size
- aggregate optimal / in range / needs attention percentages
- aggregate category distribution
- aggregate Vively score
- aggregate benchmark comparison

Corporate admins should not see:

- individual biomarker rows
- individual blood tests
- patient profile details
- patient IDs
- per-person health scores

## Prototype Backend Endpoints

Implemented in `backend/main.py`:

- `GET /api/corporate-account`
- `GET /api/employees`
- `GET /api/teams`
- `POST /api/employees/invite`
- `POST /api/employees/:id/send-invite`
- `DELETE /api/employees/:id`
- `GET /api/activation-summary`
- `GET /api/health-metrics?team=All%20Teams`
- `GET /api/billing-summary`
- `GET /api/vively/resolve-user?email=...`

The current backend uses in-memory seed data. A real version would replace that with MySQL tables matching `backend/corporate-schema.sql`.

The backend prototype is split into small files:

- `backend/main.py` handles HTTP routing and responses
- `backend/services.py` handles business logic
- `backend/seed_data.py` holds temporary prototype data
- `backend/schemas.py` defines API request and response shapes
- `backend/corporate-schema.sql` describes the future database structure

## Frontend Integration Mode

The frontend now has an API adapter:

- `src/api/mockApi.ts` for default local mock data
- `src/api/backendApi.ts` for HTTP calls to the corporate backend
- `src/api/index.ts` to choose between them

Default mode:

```bash
npm run dev
```

Backend mode:

```bash
npm run setup:backend
npm run server
npm run dev:backend
```

This keeps the prototype easy to demo while still showing the backend integration path.
