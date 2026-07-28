# cms/ — Directus

Directus runs from the official image (see `infra/docker-compose.yml`) and is the
no-code admin where the team manages trips, dates, capacity and photos.

## Files

- `bootstrap.mjs` — one command that creates the collections, grants public read,
  and seeds content. Idempotent (safe to re-run).
- `seed.json` — the initial content (6 categories, 8 destinations, 10 trips),
  generated from the frontend's placeholder data so the CMS and site match.
- `snapshots/` — (optional) schema snapshots for reproducibility.

## First-time setup

```bash
# 1. Start the stack (Postgres + Directus + frontend)
cd infra && docker compose up --build     # Directus → http://localhost:8055

# 2. In another terminal, create the schema + seed the content
cd .. && npm run cms:bootstrap            # imports seed images too — give it a minute
```

### Upgrading an already-seeded Directus

The schema now uses click-to-add lists and real image uploads. If you ran an
earlier version (string image URLs / raw-JSON fields), do a clean re-create:

```bash
npm run cms:reset        # drops categories/destinations/trips (+ junctions), then re-run:
npm run cms:bootstrap
```

`bootstrap.mjs` reads `infra/.env` for the admin login and Directus URL. Override
with env vars if needed:

```bash
DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_ADMIN_EMAIL=you@example.com \
DIRECTUS_ADMIN_PASSWORD=secret \
npm run cms:bootstrap
```

## Data model (collections created)

| Collection | Key fields |
|---|---|
| `categories` | slug, name, blurb, icon |
| `destinations` | slug, name, country, region, intro, description, heroImage, gallery[], published |
| `trips` | slug, title, country (KG/US), region, categories[], summary, description, heroImage, gallery[], durationDays, priceFrom, currency, difficulty, groupSizeMax, featured, highlights[], itinerary (json), departures (json), published |

Editing niceties:

- **heroImage** — a single image you upload (or pick from the library) by drag-drop.
- **gallery** — drag in as many images as you like; reorder them by dragging.
- **itinerary** — a click-to-add list: press **Create New**, fill Day / Title /
  Description. No JSON.
- **departures** — a click-to-add list with date pickers, capacity/spots-taken
  number fields and an Open/Full/Closed dropdown. Update `spotsTaken` as people
  join; set a departure to **Full** to grey it out on the site.
- **categories / highlights** — quick **tags** (type and press enter).

Unpublished trips/destinations are hidden from the site.

> **v1 note:** `departures` still live on the trip (manual capacity, per the design
> doc) rather than as a separate booking collection. The online-booking upgrade —
> a dedicated `Departure` collection — is tracked in `to-do.md` (Later).

## How the site reads this

The frontend content layer (`frontend/lib/content.ts`) fetches published items from
Directus and **falls back to placeholder data** if the CMS is unreachable — so the
site always renders. Pages revalidate (ISR) every 60s, so edits appear within a
minute (or trigger an on-publish revalidation later).

If public read wasn't granted automatically, enable it once in the UI:
**Settings → Access Policies → Public → add READ** on `categories`, `destinations`,
`trips`.

## Useful commands

```bash
# export current schema to a committed snapshot
docker compose exec directus npx directus schema snapshot /directus/snapshots/schema.yml
```

Admin UI: http://localhost:8055 (credentials from `infra/.env`).
