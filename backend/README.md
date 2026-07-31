# Corporate Backend Prototype

This folder contains the small backend layer for the corporate dashboard prototype.

It is written with Python FastAPI so the routing, data models, and service logic are easy to read. The backend exposes Anton's target route group only:

- `/v2/companies/{company}/...` follows Anton's target Vively API contract as closely as possible.

- `main.py` defines the HTTP API endpoints.
- `services.py` contains the dashboard business logic.
- `seed_data.py` contains temporary in-memory prototype data.
- `schemas.py` defines simple request shapes.
- `corporate-schema.sql` describes the future corporate database tables.

## Setup

Install the backend dependencies once:

```bash
python3 -m pip install -r backend/requirements.txt
```

Run the backend:

```bash
npm run server
```

The backend runs at:

```text
http://127.0.0.1:4000
```

FastAPI also provides API docs at:

```text
http://127.0.0.1:4000/docs
```

You can also import the Postman collection:

```text
docs/vively-corporate-dashboard.postman_collection.json
```

## Frontend Backend Mode

Start the frontend in backend mode:

```bash
npm run dev:backend
```

Default `npm run dev` still uses the frontend mock API so the prototype remains easy to demo without starting the backend.

## Target API Alignment

The `/v2` routes follow the conventions Anton sent back for handover:

- Company-scoped routes live under `/v2/companies/{company}`.
- Responses are wrapped in a top-level `data` key.
- Corporate people are exposed as `members`, not `employees`.
- Teams are first-class resources with stable `id`, `name` and `member_count`.
- Member names are split into `first_name` and `last_name`.
- The frontend does not receive `vively_user_id`, `vively_patient_id`, `corporate_account_id`, raw `team_id` fields or real invitation token values from the member payload.
- Health metrics use `below_privacy_threshold`; below-threshold cohorts return `categories: null`.
- Health categories include `optimal`, `in_range` and `needs_attention` in snake_case so the current health matrix can still render.

## Privacy Design

This backend only returns corporate workflow data and aggregate health metrics.

Individual biomarker rows, blood tests, patient profile data, and per-person health results should remain in Vively-owned systems. The health metrics endpoint applies a privacy threshold before returning category breakdowns.
