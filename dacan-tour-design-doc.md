# Dacan Tour — Website High-Level Design

**Status:** Draft v2 · **Owner:** Akan · **Date:** 2026-07-21
**Type:** Full-stack lead-generation website (no online payment in v1)

---

## 1. Overview

Dacan Tour is a travel company Akan runs from the United States. It already operates
guided trips around the US — Alaska (northern lights + skiing), Colorado (skiing),
Hawaii, the Arizona/Utah canyons, and the West Coast of California (Big Sur) — mostly for
students and young travelers from Central Asia, Russia, and Europe who study and live in
the US. Today the company lives only on Instagram.

The new website unifies two things:

1. **Kyrgyzstan trips — the focus.** New trips for tourists from the US and Europe who
   want to travel Kyrgyzstan's mountains and nature.
2. **US trips — the trust-builder.** The existing US trips are proof that Dacan Tour
   already delivers great experiences, which is what earns a new traveler's confidence to
   book something in a country they've never been to.

**The core thesis is trust.** Kyrgyzstan is unfamiliar to most Western travelers, so the
site must make one thing obvious: Dacan Tour is US-based, already runs trips travelers
love, Akan can meet people in person here in the States, and there's an on-the-ground team
in Kyrgyzstan that organizes everything. The US trips and the "meet/chat with us" path are
there to convert that unfamiliarity into confidence.

**The experience must be beautiful.** Most tour-company sites are boring. This one should
feel modern and cinematic — full-bleed photography, smooth scroll, the kind of site where
you keep scrolling just to see the next view of Kyrgyzstan.

### Goals

- Sell the beauty of Kyrgyzstan and drive qualified inquiries.
- Use the existing US trips as visible social proof / trust.
- Support two Kyrgyzstan trip modes: **fixed departures** (set dates + capacity limits)
  and **fully customizable trips** (tell us what you want, we build it).
- Everything manageable from an admin backend, on **free-tier infrastructure** to start.
- A clean, testable, containerized architecture that can grow into paid cloud later.

### Non-goals (v1)

- Online payment / checkout (inquiries and calls close the deal).
- Automated availability/booking (capacity is shown and managed by hand in the CMS).
- User accounts / login for travelers.
- Multi-language (English only for v1).

---

## 2. Audience & trust model

**Two audiences, one funnel:**

- **US-based young travelers / students** (the current customers) — already trust the
  brand from US trips; the site keeps them and cross-sells Kyrgyzstan.
- **New US & European tourists** wanting Kyrgyzstan — need trust first. The path for them:
  see beautiful Kyrgyzstan → see proof (US trips, real photos, Instagram) → low-commitment
  action (submit interest / message / meet Akan in the US) → team in Kyrgyzstan arranges
  the trip.

Every page carries trust signals: real trip photography, the US-trip track record, an
Instagram feed, and a clear "talk to a real person" CTA (chat / call / meet).

---

## 3. Kyrgyzstan offering (content plan)

**Trip categories to showcase:** horse riding (Silk Road), trekking, historic, city tours,
and scenic/nature highlights.

**Signature spots to feature:** Kel-Suu lake, Song-Köl (horse riding, yurt stays, Silk
Road), plus the country's most-loved destinations (e.g. Ala-Kul, Issyk-Kul, Jeti-Ögüz,
Tash Rabat, Skazka canyon, Burana tower) as we finalize the lineup.

**Two ways to book Kyrgyzstan:**

- **Fixed departures** — a specific trip with set dates and a participant limit (e.g. an
  8-day Song-Köl horse-riding trip, max 12 people, departing a given date). The site shows
  dates, spots remaining, and an inquiry/reserve-interest button. Capacity is updated by
  hand in the CMS for v1.
- **Customizable trips** — a dedicated panel that says, in effect, *"Tell us what you want
  to see and we'll build a unique trip for you."* The visitor lists interests (regions,
  activities, rough dates, group size) and submits interest; the team calls or texts to
  design the trip together. This is intentionally **not** an interactive builder — it's a
  simple, friendly interest form.

---

## 4. Information architecture

```
Home  (cinematic Kyrgyzstan hero → US-trips trust → categories → CTA)
├── Kyrgyzstan
│   ├── Trips (fixed departures — filter by category / date / region)
│   │   └── Trip detail (gallery, itinerary, dates, spots left, inquiry)
│   ├── Build your own trip (customizable interest panel)
│   └── Destinations (Kel-Suu, Song-Köl, … — SEO landing pages)
├── USA Trips (Alaska, Colorado, Hawaii, Arizona/Utah, California)
│   └── Trip detail
├── About  (story, the US + Kyrgyzstan teams, why trust us)
└── Contact  (form + WhatsApp + "meet us in the US")

Global: header nav, footer, Instagram feed, persistent inquiry CTA, floating WhatsApp.
```

The homepage leads with Kyrgyzstan (the emotional hook) and quickly reinforces trust with
the US trips before pushing toward an inquiry.

---

## 5. System architecture

A decoupled, containerized architecture in one monorepo: a Next.js frontend, a NestJS
backend for business logic, Directus as the open-source CMS/admin over PostgreSQL, and a
single Postgres database. Everything runs locally via `docker-compose` and deploys to
free-tier services.

```
                         ┌──────────────────────────────┐
     Visitor ─────────►  │  Frontend — Next.js (Vercel)  │
                         │  cinematic pages, SSR/SSG     │
                         └───────┬───────────────┬──────┘
              content (trips,    │               │  inquiries /
              photos, dates)     │               │  custom-trip interest
                                 ▼               ▼
                    ┌────────────────────┐  ┌────────────────────────┐
                    │ Directus (CMS/API) │  │  Backend — NestJS API  │
                    │ admin UI + REST/GQL│  │ validation, business   │
                    │ Docker container   │  │ logic, email/notify    │
                    └─────────┬──────────┘  └───────────┬────────────┘
                              │                         │
                              └───────────┬─────────────┘
                                          ▼
                            ┌──────────────────────────┐
                            │  PostgreSQL (Neon free)   │
                            │  serverless, scale-to-zero│
                            └──────────────────────────┘

   Notifications: NestJS ──► Resend (email to team) + WhatsApp click-to-chat on site.
   Admin (Akan/team) ──► Directus UI to manage trips, departures, capacity, photos.
```

**Responsibilities:**

- **Frontend (Next.js)** renders the beautiful public site. It reads content (trips,
  destinations, departures, galleries) from Directus, and posts inquiries / custom-trip
  interest to the NestJS API. Marketing pages are statically generated / cached for speed
  and SEO; content revalidates on a schedule or on publish.
- **Directus (CMS)** gives Akan and the team a ready-made admin UI to manage all content —
  trips, categories, destinations, departures (dates + capacity), and photo galleries —
  without touching code. It exposes that content over REST/GraphQL for the frontend.
- **NestJS (backend)** owns business logic that isn't just content: validating and storing
  inquiries and custom-trip requests, capacity/interest rules, and sending notifications
  (Resend email now; Telegram/WhatsApp later). This is also where tests, Docker, and the
  clean architecture you want to learn live.
- **PostgreSQL** is the single source of truth, shared by Directus (content collections)
  and NestJS (inquiries). Serverless + scale-to-zero keeps it effectively free at low
  traffic.

---

## 6. Monorepo layout

```
dacantour/
├── frontend/               # Next.js app (App Router, TypeScript, Tailwind, shadcn)
│   ├── app/ components/ lib/
│   └── Dockerfile
├── backend/                # NestJS API
│   ├── src/ (modules: inquiries, custom-trips, notifications, health)
│   ├── test/ (unit + e2e)
│   └── Dockerfile
├── cms/                    # Directus config, extensions, schema snapshots
│   └── Dockerfile (or official image + env)
├── infra/
│   ├── docker-compose.yml       # local: postgres + directus + backend + frontend
│   ├── docker-compose.prod.yml  # single-VM deploy option
│   └── env examples
├── packages/               # (optional) shared TS types/schemas used by FE + BE
├── .github/workflows/      # CI: lint, typecheck, test, build, deploy
└── README.md
```

Separate `frontend/` and `backend/` folders as requested, each independently Dockerized,
with `infra/` holding the compose files and deployment config. A shared `packages/` folder
lets the frontend and backend reuse the same TypeScript types and Zod schemas.

---

## 7. Data model (core entities)

Managed in **Directus** (content): `Trip`, `Category`, `Destination`, `Departure`, `Media`.
Owned by **NestJS** (submissions): `Inquiry`, `CustomTripRequest`.

```
Trip
  id, slug, title, country (US | KG), summary, description (rich),
  categories[], destinations[], heroImage, gallery[], durationDays,
  priceFrom, currency, difficulty, featured, published

Category        id, slug, name        # horse-riding, trekking, historic, city, scenic, ski...
Destination     id, slug, name, country, intro, heroImage, gallery[]   # Kel-Suu, Song-Köl...

Departure        # a fixed-date instance of a Trip with a capacity limit
  id, tripId, startDate, endDate, capacity, spotsTaken, status (open|full|closed)

Inquiry          # general or fixed-trip interest
  id, type (general | fixed-trip), tripId?, departureId?, name, email,
  phone?, groupSize?, preferredDates?, message, status, createdAt

CustomTripRequest   # "build your own Kyrgyzstan trip" interest panel
  id, name, email, phone?, interests[] (regions/activities), rough dates,
  groupSize, message, status, createdAt
```

For v1, `spotsTaken` on a `Departure` is updated manually in Directus — no automated
booking. Every field a future online-booking engine would need (dates, capacity, price) is
already present, so that upgrade won't require reshaping the model.

---

## 8. Key flows

**Browse → inquire (fixed trip):** visitor opens a trip page (content from Directus) →
clicks "Ask about this trip / reserve interest" → form (React Hook Form + Zod) → `POST`
to NestJS → server re-validates → stores `Inquiry` → Resend emails the team → success
state, WhatsApp fallback if the API fails.

**Build your own Kyrgyzstan trip:** visitor opens the custom panel → lists what they want
to see + rough dates/group size → submits → NestJS stores a `CustomTripRequest` → team is
notified → team calls/texts to design the unique trip.

**Manage content (admin):** Akan/team log into Directus → add or edit trips, upload photos,
set departure dates, adjust remaining capacity, publish. Frontend picks up changes on
revalidation.

Spam protection on both forms: honeypot field + a lightweight rate limit on the API; add
Cloudflare Turnstile later only if needed.

---

## 9. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js (App Router) + TypeScript** | SSR/SSG, great SEO, ideal for a fast cinematic site. |
| Styling | **Tailwind CSS + shadcn/ui** | Fast, consistent, accessible components you own. |
| Motion | **Framer Motion** (+ Lenis smooth scroll, optional GSAP) | The "keep scrolling for the views" feel. |
| Images/video | **next/image**, optimized hero media | Fast, modern formats — essential for a photo-heavy site. |
| Backend | **NestJS (TypeScript)** | Structured, testable, Dockerized; shares types with the frontend. |
| Validation | **Zod** (shared FE/BE) | One schema validates client and server. |
| CMS / admin | **Directus** (open source, Docker) | Ready-made admin UI + API over Postgres — manage everything, free. |
| Database | **PostgreSQL** on **Neon** (free, serverless) | Efficient, scale-to-zero = lowest cost; Supabase is an equal alternative. |
| Email | **Resend** | Simple transactional email for inquiry notifications. |
| Containers | **Docker + docker-compose** | Local parity + portable deploys, as you want. |
| CI/CD | **GitHub Actions** | Free: lint, typecheck, test, build, deploy on merge. |
| Hosting | **Vercel** (frontend) + free container host (backend/CMS) + **Neon** (DB) | All free tier to start; see §11. |
| Analytics | **Vercel Analytics** or **Plausible** | Lightweight, privacy-friendly. |

**Directus vs Strapi:** both are solid open-source, self-hostable CMSs. Directus sits
directly on a plain Postgres schema (great if you ever want the backend to read the same
tables) and has a polished admin; Strapi is more code-first. Either works — Directus is the
default recommendation for the least custom code.

---

## 10. Testing strategy

- **Backend (NestJS):** Jest unit tests for services/validation; e2e tests (Supertest)
  for the inquiry and custom-trip endpoints with the email provider mocked.
- **Frontend (Next.js):** Vitest + React Testing Library for components; Playwright for a
  couple of critical end-to-end flows (browse a trip → submit an inquiry).
- **Contract safety:** shared Zod schemas in `packages/` keep FE and BE payloads in sync.
- **CI gate:** every pull request runs lint + typecheck + unit tests + build; nothing
  merges red. Deploys run only on `main` after tests pass — matching your "test before I
  deploy something new" requirement.

---

## 11. Deployment & cost (free tier first)

| Component | Free-tier home | Notes |
|---|---|---|
| Frontend (Next.js) | **Vercel** | Free hobby tier, CDN, preview deploys per branch. |
| Database (Postgres) | **Neon** | Free serverless Postgres, scale-to-zero. Supabase = alt. |
| Backend (NestJS) + Directus | **Render / Fly.io / Railway** free tier | Free web services; note cold starts on Render's free tier. |
| Media storage | Directus + free object storage (e.g. Cloudflare R2 free tier) | Keeps large photos off the app servers. |
| CI/CD | **GitHub Actions** | Free minutes for a project this size. |
| Domain | Purchased by Akan | Point DNS at Vercel; add a records for Resend email domain. |

**Cheapest always-on alternative:** run `docker-compose.prod.yml` (Postgres + Directus +
NestJS) on a single **Oracle Cloud Always-Free** VM (generous ARM allowance, no cold
starts, $0), with the frontend still on Vercel. Good if free container hosts' cold starts
become annoying. **Scale-up path:** when traffic outgrows free tier, lift the same
containers to a paid managed platform (Render/Fly paid, or a cloud VM) with no rewrite —
the whole point of Dockerizing now.

---

## 12. Delivery roadmap

**Phase 0 — Foundations:** monorepo, docker-compose (Postgres + Directus + NestJS +
Next.js) running locally, GitHub Actions CI skeleton, design tokens (colors/typography),
deploy a hello-world of each service to its free host.

**Phase 1 — Content + public site:** Directus schema (Trip, Category, Destination,
Departure, Media); Next.js homepage, Kyrgyzstan trips catalog + trip detail, USA trips,
destinations, About/Contact. Seed real US trips and the first Kyrgyzstan trips.

**Phase 2 — Inquiry + custom-trip system:** NestJS inquiry + custom-trip endpoints, Zod
validation, Resend notifications, forms + success/error states, WhatsApp fallback, spam
protection, tests.

**Phase 3 — Beauty + launch polish:** cinematic hero media, scroll animations, Instagram
feed, SEO (metadata, `TouristTrip` JSON-LD, sitemap), analytics, performance +
accessibility passes, legal/privacy pages. Then buy domain, wire DNS + Resend, launch.

**Later (post-v1):** multi-language (RU/other), automated availability/online booking
(model already supports it), reviews, richer trip-planning tools.

---

## 13. Open questions / to confirm

- Branding: do we have a logo, colors, and fonts, or should the design phase create them?
- How many trips at launch (US + Kyrgyzstan) and roughly how many photos each?
- Which inbox should inquiries go to, and the WhatsApp business number for click-to-chat?
- Domain name choice, and the email-sending domain for Resend (needs DNS records).
- Preferred free container host to start: Render, Fly.io, Railway, or the Oracle
  Always-Free VM?
- Media storage: Directus local vs an object store (R2/S3) for the large photos?
```
