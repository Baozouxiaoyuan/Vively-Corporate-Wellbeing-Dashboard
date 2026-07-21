# Vively Corporate Wellbeing Dashboard Prototype

Frontend MVP prototype for a corporate admin dashboard. The app is built with React, Vite, TypeScript and Tailwind CSS.

The prototype uses local mock API functions instead of a real backend. The goal is to validate the main admin workflow and the expected frontend data shape before integration.

## Run Locally

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Pages

- `/login` - prototype corporate admin entry point
- `/health-metrics` - first page after sign in, with aggregate-only team health metrics and privacy threshold handling
- `/employees` - people, employee invites, email sending mock, activation summary and funnel
- `/billing` - mock billing summary and charge history
- `/settings` - company profile, admins and privacy rules

The old `/activation` route redirects to `/employees` because activation is now part of the employee workflow.

## Key Interactions

- Invite an employee
- Select an existing team or enter a custom team
- Copy an invite link
- Mock send an invitation email
- Remove an employee from the corporate mock list
- Search employees by name, email or team
- Filter health metrics by team
- Hide health metrics when the cohort is below the privacy threshold

## Privacy Assumption

Corporate admins should only see aggregate health data. The UI does not display patient IDs, individual biomarker rows, blood test rows, or per-person health results.

Health metrics are shown only when the selected cohort meets the configured privacy threshold in `src/config/product.ts`.

## Project Structure

```text
src/api/          mock API functions
src/data/         mock records
src/pages/        main route pages
src/components/   reusable UI and layout components
src/types/        TypeScript data contracts
src/config/       small product settings
docs/             API and integration notes
```

## Mock API

The current frontend API contract is documented in `docs/MOCK_API_SPEC.md`.

## Backend Prototype

This repo also includes a small corporate backend prototype:

```bash
npm run setup:backend
npm run server
```

It runs at `http://localhost:4000` and exposes dashboard APIs under `/api`.

To run the frontend against the backend:

```bash
npm run server
npm run dev:backend
```

Default `npm run dev` still uses the in-browser mock API so the prototype can run without a backend server.

Backend design notes:

- `backend/README.md`
- `backend/corporate-schema.sql`
- `docs/CORPORATE_BACKEND_PLAN.md`
