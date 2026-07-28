# Dacan Tour — Build To-Do (end-to-end)

Source of truth for building the website from `dacan-tour-design-doc.md`, phase by
phase. Work top to bottom. Each phase ends with a **Verify** block — don't move on
until it passes. Claude Code project setup follows `claude-code-setup-notes copy.md`.

**Status:** **Phase 0 ✅** (monorepo, Claude Code config + hooks, Docker, compose,
CI). **Phase 1 ✅** (Directus schema + seed + one-command bootstrap; frontend reads
the CMS with a static fallback; click-to-add lists + image uploads). **Phase 2 ✅**
(NestJS API: inquiries + custom-trips, shared Zod, Resend, honeypot + rate limit;
forms wired). **Phase 3 ✅** (SEO + JSON-LD + sitemap/robots, analytics, a11y &
reduced motion, error/loading/404, legal copy). **Phase 4 ✅** (37 unit tests,
Playwright journeys, backend e2e on Postgres, CI gate). Next up: **Phase 5 —
deploy to free tier.**

Legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Local dev quickstart (run in VS Code)

```bash
# frontend only (already works today)
cd frontend && npm install && npm run dev      # http://localhost:3000

# full stack (after Phase 0)
cd infra && docker compose up --build           # frontend :3000 · directus :8055 · api :4000 · db :5432
```

---

## Phase 0 — Foundations & Claude Code setup

Monorepo, containers, CI skeleton, and the `.claude/` project config so Claude Code
behaves consistently in VS Code.

- [x] Monorepo layout: `frontend/` `backend/` `cms/` `infra/` `packages/` `.github/`
- [x] Root `README.md` (what each folder is, how to run)
- [x] Root `CLAUDE.md` — build/test/lint commands, architecture overview, conventions, gotchas
- [x] `CLAUDE.local.md` (gitignored) — local URLs / personal notes stub
- [x] `.claude/settings.json` — permissions (allow/deny) + hooks
- [x] `.claude/hooks/` scripts: auto-format on Edit|Write (prettier), block `rm -rf` / edits to `.env` & lockfiles
- [x] Root tooling: `.gitignore`, `.editorconfig`, `.nvmrc`, `.prettierrc`, root `package.json` (workspaces + shared scripts)
- [x] `frontend/Dockerfile` (multi-stage, standalone output) + `.dockerignore`
- [x] `backend/Dockerfile` placeholder (filled in Phase 2)
- [x] `cms/` Directus via official image + env (compose)
- [x] `infra/docker-compose.yml` — postgres + directus + frontend (backend behind `--profile api`)
- [x] `infra/docker-compose.prod.yml` — single-VM deploy option
- [x] `infra/.env.example` + `frontend/.env.example`
- [x] `.github/workflows/ci.yml` — lint + typecheck + build (test added Phase 4)
- [x] Enable `next.config` `output: "standalone"` for Docker
- [x] **Verify:** compose + CI YAML valid · frontend build passes & emits `.next/standalone/server.js` · `.claude/settings.json` valid
      _(note: `docker compose config` + live hook firing to confirm on your machine — Docker isn't in the build sandbox)_

## Phase 1 — Content model & CMS (Directus) ✅

Give Akan a no-code admin for trips/dates/photos; move the frontend off static data.

- [x] Directus service in compose, connected to Postgres, admin bootstrapped via env
- [x] Collections + fields per design doc §7: `Category`, `Destination`, `Trip` (Departure + Media modeled as JSON/URL for v1 — see note)
- [x] Trip categories/gallery/highlights as tags, itinerary/departures as JSON (v1 manual capacity)
- [x] Public role: read-only on **published** items only (`cms/bootstrap.mjs`, with UI fallback instructions)
- [x] Seed data: 6 categories + 8 destinations + 10 trips, generated from `lib/data.ts` → `cms/seed.json`
- [x] Frontend: Directus REST client `lib/cms.ts` + content layer `lib/content.ts` (CMS with static fallback)
- [x] All pages read from the content layer; async + `revalidate = 60` (ISR)
- [x] Map Directus asset URLs into `next.config` `images.remotePatterns` (localhost + directus host)
- [x] One-command setup: `npm run cms:bootstrap`
- [x] **Verify:** `tsc` clean · fallback path returns full content when Directus is down (unit-tested) · bootstrap + seed.json valid
      _(live check on your machine: run bootstrap, edit a trip in Directus, confirm it appears within ~60s)_
- [x] Admin UX upgrade: **click-to-add** lists for itinerary & departures (date pickers, dropdowns) — no raw JSON
- [x] Admin UX upgrade: **drag-drop image uploads** — heroImage (single file) + gallery (multiple files) on trips & destinations
- [x] Seed imports images from URLs; public read extended to `directus_files` + junctions; `npm run cms:reset` for clean upgrade
- [x] Frontend resolves Directus `/assets` URLs (and still accepts plain URLs for the fallback)
- [ ] _Later:_ true `Departure` collection (M2O) for the online-booking upgrade
- [ ] _Optional:_ commit a schema snapshot to `cms/snapshots/` · on-publish revalidation webhook (vs timed)

## Phase 2 — Backend (NestJS): inquiries + custom-trip system ✅

The business logic that isn't content: store submissions, validate, notify.

- [x] NestJS scaffold in `backend/` (strict TS), Dockerfile present
- [x] DB access to Postgres via **TypeORM** — entities `Inquiry`, `CustomTripRequest` (synchronize in dev)
- [x] `packages/schemas` (`@dacantour/schemas`) — shared **Zod** schemas used by FE + BE, builds to dist
- [x] Modules: `health`, `inquiries`, `custom-trips`, `notifications`
- [x] `POST /api/inquiries` and `POST /api/custom-trips` — Zod-validate → persist → notify
- [x] Resend email to team (abstracted `NotificationsService`; logs when no API key — mocked in tests)
- [x] Spam protection: silent honeypot (`company`) + rate limit (`@nestjs/throttler`, 5/min on writes)
- [x] CORS locked to `FRONTEND_ORIGIN`
- [x] Frontend: `InquiryForm` POSTs to the API; success/error states; WhatsApp fallback on failure
- [x] Unit tests: services (persist + honeypot) + Zod pipe; DB-free health e2e
- [x] **Verify (sandbox):** 11 logic assertions pass (schemas, pipe, both services); all 18 backend files transpile; frontend `tsc` clean
      _(on your machine: `npm install` then `cd backend && npm test && npm run build`, and a live form submit → row + email/log)_

## Phase 3 — Beauty & launch polish ✅

- [x] Scroll/motion refinements + **reduced-motion support** (Reveal, Hero parallax, Lenis, CSS)
- [x] SEO: per-page metadata + canonical URLs, OG/Twitter cards, `sitemap.ts` (CMS-driven), `robots.ts`
- [x] Structured data: `TouristTrip` (with offers + itinerary), `TouristDestination`, `TravelAgency`, `BreadcrumbList`
- [x] Analytics: privacy-friendly Plausible via env — renders nothing when unset
- [x] Accessibility: visible focus rings, skip-to-content link, aria on menu/gallery, keyboard gallery (Esc/←/→), descriptive alt text
- [x] Real legal/privacy copy (plain-language; flagged for lawyer review before launch)
- [x] Global `error.tsx`, `loading.tsx`, branded `not-found.tsx`
- [x] **Verify:** `tsc` clean · 11 JSON-LD assertions pass against rendered output
- [ ] Real hero media (needs your photos) — swap picsum URLs / upload in Directus
- [ ] Instagram feed (needs an API token or embed) — currently a placeholder strip
- [ ] Lighthouse run + perf tuning on the deployed site (do after Phase 5)

## Phase 4 — Testing & CI gate ✅

- [x] Backend: Jest unit (services + Zod pipe, mailer mocked) + **e2e** (Supertest → real Postgres) covering both endpoints, validation 400s and honeypot
- [x] Frontend: Vitest + RTL — **37 tests** across InquiryForm (submit, both endpoints, API/network failure → WhatsApp fallback, honeypot), TripsExplorer filtering, TripBooking capacity/full/closed, content-layer CMS fallback, JSON-LD, date formatting
- [x] Playwright: critical journey (home → catalog → filter → trip → inquiry), failure path, build-your-own, site-health across 9 pages, 404, structured data, sitemap/robots, mobile menu, skip-link — desktop + mobile projects
- [x] Contract safety via shared Zod in `packages/schemas`
- [x] CI: `frontend` (lint/typecheck/test/build), `backend` (test/e2e w/ Postgres service/build), `e2e` (Playwright) + a **`ci-gate`** job to set as the single required check
- [x] **Verify:** 37/37 unit tests green · all backend files transpile · CI YAML valid · `tsc` clean
- [x] 🐛 **Bug caught by these tests:** departures rendered a day early for any negative-UTC visitor (i.e. all US traffic) — `"2026-07-12"` displayed as *Jul 11*. Fixed in `lib/utils.ts` + regression test.
- [ ] Delete the leftover scratch file: `rm frontend/dbg.test.tsx`
- [ ] Set `ci-gate` as the required status check in GitHub branch protection for `main`

## Phase 5 — Deployment (free tier first)

- [ ] Frontend → **Vercel** (project + env + preview deploys)
- [ ] Database → **Neon** (free serverless Postgres) — connection string in envs
- [ ] Backend + Directus → Render / Fly / Railway free, **or** Oracle Always-Free VM via `docker-compose.prod.yml`
- [ ] Media storage → Cloudflare R2 (or Directus local) — wire Directus storage
- [ ] Domain: point DNS at Vercel; add Resend email-domain DNS records
- [ ] Secrets: production env vars set per service (no secrets committed)
- [ ] **Verify:** production smoke test — pages load, CMS content shows, an inquiry submits and emails the team

---

## Open questions to confirm (from design doc §13)

- [ ] Branding: keep the palette/logo Claude designed, or supply real assets?
- [ ] Launch trip count (US + KG) and photos per trip
- [ ] Inquiry inbox address + WhatsApp business number for click-to-chat
- [ ] Domain name + Resend sending domain
- [ ] Free container host preference: Render / Fly / Railway / Oracle VM
- [ ] Media storage: Directus local vs R2/S3

## Claude Code project setup checklist (from setup notes)

- [ ] `/init` in the repo to generate/refresh `CLAUDE.md`
- [ ] `.claude/settings.json` permissions + hooks committed
- [ ] MCP servers added as needed (e.g. Playwright for e2e)
- [ ] Skills in `.claude/skills/` for repeated workflows (optional)
- [ ] Commit `.claude/` (excluding `settings.local.json`) so the setup is shared
