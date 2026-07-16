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
- `/dashboard` - account, activation, billing and aggregate health overview
- `/employees` - employee invites, email sending mock, activation summary and funnel
- `/health-metrics` - aggregate-only health metrics with privacy threshold handling
- `/billing` - mock billing summary and charge history

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

