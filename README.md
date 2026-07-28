# Dacan Tour

Cinematic, trust-focused lead-generation website for Dacan Tour — small-group
trips through Kyrgyzstan's mountains, with the existing US trips as social proof.

Full design in [`dacan-tour-design-doc.md`](./dacan-tour-design-doc.md); the build
plan and progress live in [`to-do.md`](./to-do.md).

## Monorepo layout

```
dacantour/
├── frontend/     # Next.js (App Router, TS, Tailwind, Framer Motion) — public site
├── backend/      # NestJS API — inquiries, custom-trip requests, notifications
├── cms/          # Directus config, schema snapshots, seed
├── infra/        # docker-compose (local + prod), env examples
├── packages/     # shared TypeScript types + Zod schemas (FE + BE)
├── .github/      # CI: lint, typecheck, test, build, deploy
└── .claude/      # Claude Code project config (settings, hooks)
```

## Quickstart

```bash
# Frontend only (works today)
cd frontend && npm install && npm run dev      # http://localhost:3000

# Full stack (after Phase 0)
cd infra && docker compose up --build
# frontend :3000 · directus :8055 · api :4000 · postgres :5432
```

## Architecture (summary)

Next.js reads content from **Directus** (CMS over Postgres) and posts inquiries to
the **NestJS** API, which validates (shared **Zod** schemas), stores submissions in
**Postgres**, and notifies the team via **Resend**. Everything is containerized and
runs locally via `docker-compose`; production targets free-tier hosts (Vercel +
Neon + a free container host). See the design doc §5.

## Tech stack

Next.js · NestJS · Directus · PostgreSQL · Zod · Tailwind + shadcn · Framer Motion ·
Docker · GitHub Actions · Resend · Vercel + Neon.
