# CLAUDE.md — Dacan Tour

Project context for Claude Code. Keep this current; it's committed and shared.

## What this is

A cinematic, trust-focused lead-generation website for **Dacan Tour** — small-group
trips through Kyrgyzstan (the focus) with existing US trips as social proof. No online
payment in v1; inquiries and calls close the deal. Full spec: `dacan-tour-design-doc.md`.
Build plan and progress: `to-do.md` — **read it and keep the checkboxes updated.**

## Monorepo

```
frontend/   Next.js 14 App Router · TS · Tailwind · Framer Motion · Lenis   (public site)
backend/    NestJS · TS · Zod · Prisma/TypeORM                              (inquiries, notify)
cms/        Directus (content: Trip, Category, Destination, Departure, Media)
packages/   shared TS types + Zod schemas used by FE + BE
infra/      docker-compose (local + prod), env examples
```

## Commands

```bash
# Frontend
cd frontend && npm run dev          # http://localhost:3000
cd frontend && npm run build        # production build (needs internet for Google Fonts)
cd frontend && npm run lint
cd frontend && npm test             # vitest unit/component tests
cd frontend && npm run test:e2e     # playwright (builds + serves on :3100, API stubbed)

# Backend
cd backend && npm run start:dev     # http://localhost:4000
cd backend && npm test              # jest unit (no DB needed)
cd backend && npm run test:e2e      # supertest e2e (needs Postgres running)

# Full stack
cd infra && docker compose up --build

# Repo-wide (root)
npm run lint | npm run typecheck | npm run test | npm run format
```

## Architecture

Next.js renders the public site, reads content from **Directus** (REST/GraphQL over
Postgres), and POSTs inquiries / custom-trip requests to the **NestJS** API. NestJS
validates with **shared Zod schemas** (`packages/`), stores submissions in Postgres,
and emails the team via **Resend**. Marketing pages are SSG/ISR for speed + SEO.

## Conventions

- **TypeScript strict** everywhere. No `any` without a comment justifying it.
- **Validation:** one Zod schema per payload in `packages/`, imported by both FE and BE.
- Frontend: App Router. Server Components by default; add `"use client"` only when needed
  (state, effects, Framer Motion). Styling via Tailwind tokens in `tailwind.config.ts`
  (brand colors: `lake`, `pine`, `sun`, `clay`, `sand`, `ink`). Reusable UI in `components/`.
- Content shapes mirror the Directus data model (design doc §7). Today the frontend reads
  placeholder data from `frontend/lib/data.ts`; Phase 1 swaps this for the Directus client.
- Forms include a honeypot field; the API adds rate limiting. Never remove spam protection.
- **Run the build/tests before declaring a task done.** Nothing merges red.
- Conventional-ish commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

## Gotchas

- `next/font/google` fetches fonts at build time → the first build needs network access
  (fine locally and on Vercel; fails in fully offline sandboxes).
- Remote image hosts must be listed in `frontend/next.config.mjs → images.remotePatterns`.
- Placeholder imagery uses `picsum.photos` seeds via `img()` in `lib/data.ts` — swap for
  real Directus asset URLs in Phase 1.
- Docker frontend build needs `output: "standalone"` in `next.config`.
- **Backend emit layout:** `backend/tsconfig.json` pins `"rootDir": "./src"` and must NOT
  add a `paths` mapping into `../packages/**`. A cross-package `paths` entry lifts
  TypeScript's common root to the repo root, so it emits `dist/backend/src/main.js` and
  `nest start` dies with `Cannot find module dist/main` (while reporting "0 errors").
  `@dacantour/schemas` resolves through the npm-workspace symlink; `npm run schemas`
  (auto-run via `prestart`/`prebuild`) builds it to `packages/schemas/dist` first.
- Node's `fetch` prefers IPv6 for `localhost`; Docker publishes on IPv4. Server-side
  calls to Directus use `127.0.0.1` (see `lib/cms.ts`, `cms/bootstrap.mjs`).
- **CI uses `npm install`, not `npm ci`.** The lockfile is generated on macOS and npm
  records only the host platform's optional binaries, so `npm ci` on Linux dies with
  *"Cannot find module @rollup/rollup-linux-x64-gnu"* (npm/cli#4828). Next.js
  re-downloads its SWC binary automatically; rollup/vitest does not.
- **Dates:** never `new Date("2026-07-12")` for calendar dates — it parses as UTC
  midnight and renders a day early in US timezones. Use `parseCalendarDate` in
  `frontend/lib/utils.ts` (regression-tested).
- **One React only.** The backend must not depend on packages that pull React
  (this is why Resend is called over REST, not via its SDK, which drags in
  `@react-email/render` + React 19 and breaks the frontend's tests). Root
  `package.json` also pins `overrides.react`/`react-dom` to `^18.3.1`, because
  testing libraries accept 18 *or* 19 as a peer and npm will otherwise hoist 19
  beside the app's 18 → every RTL test dies with *"A React Element from an older
  version of React was rendered"*. Changing the pin requires regenerating the
  lockfile (`rm package-lock.json && npm install`) — overrides don't apply to an
  already-resolved tree.

## Do / Don't

- DO update `to-do.md` checkboxes as phases complete.
- DO keep secrets out of git — use `.env` (gitignored) and `*.env.example` for shape.
- DON'T add online payment/booking in v1 (out of scope).
- DON'T introduce a second validation source — Zod in `packages/` is the contract.
