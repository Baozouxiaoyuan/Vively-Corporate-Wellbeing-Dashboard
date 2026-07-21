# Corporate Backend Prototype

This folder contains the small backend layer for the corporate dashboard prototype.

It is written with Python FastAPI so the routing, data models, and service logic are easy to read:

- `main.py` defines the HTTP API endpoints.
- `services.py` contains the dashboard business logic.
- `seed_data.py` contains temporary in-memory prototype data.
- `schemas.py` defines request and response shapes.
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

## Frontend Backend Mode

Start the frontend in backend mode:

```bash
npm run dev:backend
```

Default `npm run dev` still uses the frontend mock API so the prototype remains easy to demo without starting the backend.

## Privacy Design

This backend only returns corporate workflow data and aggregate health metrics.

Individual biomarker rows, blood tests, patient profile data, and per-person health results should remain in Vively-owned systems. The health metrics endpoint applies a privacy threshold before returning category breakdowns.
