# backend/ — Dacan Tour API (NestJS)

Owns the business logic that isn't content: validates and stores **inquiries** and
**custom-trip requests**, and emails the team via **Resend**. Content lives in
Directus (see `cms/`); this API only handles submissions.

## Run

```bash
# from the repo root (installs all workspaces incl. @dacantour/schemas)
npm install

# start the API (needs Postgres — e.g. `cd infra && docker compose up postgres`)
cd backend && npm run start:dev        # http://localhost:4000
curl http://localhost:4000/health

# tests
npm test            # unit (services, validation pipe) — no DB needed
npm run test:e2e    # health e2e — no DB needed
npm run build       # nest build → dist/
```

Copy `.env.example` → `.env` and set `DATABASE_URL`, `FRONTEND_ORIGIN`, and (optionally)
`RESEND_API_KEY`. Without a Resend key, notification emails are logged instead of sent,
so nothing external is required in dev.

## Endpoints

| Method | Path | Body (validated by `@dacantour/schemas`) |
|---|---|---|
| `GET`  | `/health` | — |
| `POST` | `/api/inquiries` | `InquirySchema` — general or fixed-trip inquiry |
| `POST` | `/api/custom-trips` | `CustomTripRequestSchema` — build-your-own request |

Both POST routes: Zod validation (shared with the frontend), a honeypot field
(`company`) that silently drops bots, and a rate limit of 5 submissions / minute / IP.
CORS is restricted to `FRONTEND_ORIGIN`.

## Structure

```
src/
├── main.ts                  # bootstrap, CORS, /api prefix
├── app.module.ts            # config, TypeORM (Postgres), global rate limit
├── common/zod-validation.pipe.ts
├── health/                  # GET /health
├── notifications/           # Resend mailer (logs if no API key)
├── inquiries/               # entity, service, controller, module
└── custom-trips/            # entity, service, controller, module
```

Data model: `Inquiry` and `CustomTripRequest` tables (TypeORM, `synchronize` on in dev).
The Zod schemas in `packages/schemas` are the single source of truth shared with the
frontend — never duplicate validation here.
