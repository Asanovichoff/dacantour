// ---------------------------------------------------------------------------
// Directus REST client (server-side). Reads published content for the site.
//
// heroImage is a single Directus file; gallery is a files (M2M) list. We request
// their ids and build /assets URLs from the browser-reachable Directus URL. The
// resolvers also accept plain URL strings, so the static fallback data (which
// uses picsum URLs) keeps working unchanged.
//
// Env:
//   DIRECTUS_URL             server-side base URL (in Docker: http://directus:8055)
//   NEXT_PUBLIC_DIRECTUS_URL browser-reachable base URL (used for /assets links)
//   DIRECTUS_TOKEN           optional static read token (only if not using public read)
// ---------------------------------------------------------------------------
import type { Trip, Destination, Category } from "@/lib/data";
import { img } from "@/lib/data";

// Server-side fetches use 127.0.0.1 (Node's fetch prefers IPv6 for "localhost",
// which Docker-published Directus doesn't answer on).
const BASE = (
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  "http://localhost:8055"
)
  .replace(/\/$/, "")
  .replace("//localhost", "//127.0.0.1");

// Assets must be fetched from a URL the browser can reach.
const PUBLIC_BASE = (
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  process.env.DIRECTUS_URL ||
  "http://localhost:8055"
).replace(/\/$/, "");

const TOKEN = process.env.DIRECTUS_TOKEN;
const REVALIDATE = 60; // ISR: refresh CMS content at most once a minute

async function directus<T>(path: string): Promise<T[]> {
  const res = await fetch(`${BASE}${path}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`Directus ${path} → ${res.status}`);
  const json = (await res.json()) as { data: T[] };
  return json.data ?? [];
}

/** Resolve a hero/gallery value to a URL. Accepts a file id, a file object, or a plain URL. */
function assetUrl(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v.startsWith("http") ? v : `${PUBLIC_BASE}/assets/${v}`;
  if (typeof v === "object") {
    const id = (v as { id?: string }).id;
    if (id) return `${PUBLIC_BASE}/assets/${id}`;
  }
  return "";
}

/** gallery comes back as [{ directus_files_id: {id} }] (M2M) or ["url", …] (fallback). */
function galleryUrls(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (typeof item === "string") return assetUrl(item);
      const fk = (item as { directus_files_id?: unknown }).directus_files_id;
      return assetUrl(fk ?? item);
    })
    .filter(Boolean);
}

const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

function toTrip(r: Record<string, unknown>): Trip {
  const slug = String(r.slug);
  return {
    slug,
    title: String(r.title ?? ""),
    country: (r.country as Trip["country"]) ?? "KG",
    region: String(r.region ?? ""),
    categories: arr(r.categories),
    summary: String(r.summary ?? ""),
    description: String(r.description ?? ""),
    heroImage: assetUrl(r.heroImage) || img(`${slug}-hero`, 2000, 1200),
    gallery: galleryUrls(r.gallery),
    durationDays: Number(r.durationDays ?? 0),
    priceFrom: Number(r.priceFrom ?? 0),
    currency: (r.currency as Trip["currency"]) ?? "USD",
    difficulty: (r.difficulty as Trip["difficulty"]) ?? "Moderate",
    groupSizeMax: Number(r.groupSizeMax ?? 0),
    featured: Boolean(r.featured),
    highlights: arr(r.highlights),
    itinerary: (Array.isArray(r.itinerary) ? r.itinerary : []) as Trip["itinerary"],
    departures: (Array.isArray(r.departures) ? r.departures : []) as Trip["departures"],
  };
}

function toDestination(r: Record<string, unknown>): Destination {
  const slug = String(r.slug);
  return {
    slug,
    name: String(r.name ?? ""),
    country: (r.country as Destination["country"]) ?? "KG",
    region: String(r.region ?? ""),
    intro: String(r.intro ?? ""),
    description: String(r.description ?? ""),
    heroImage: assetUrl(r.heroImage) || img(`${slug}-hero`, 2000, 1200),
    gallery: galleryUrls(r.gallery),
  };
}

function toCategory(r: Record<string, unknown>): Category {
  return {
    slug: String(r.slug),
    name: String(r.name ?? ""),
    blurb: String(r.blurb ?? ""),
    icon: (r.icon as Category["icon"]) ?? "scenic",
  };
}

const TRIP_FIELDS = "*,heroImage.id,gallery.directus_files_id.id";
const DEST_FIELDS = "*,heroImage.id,gallery.directus_files_id.id";

export async function cmsCategories(): Promise<Category[]> {
  const rows = await directus<Record<string, unknown>>("/items/categories?limit=-1&sort=id");
  return rows.map(toCategory);
}

export async function cmsDestinations(): Promise<Destination[]> {
  const rows = await directus<Record<string, unknown>>(
    `/items/destinations?limit=-1&filter[published][_eq]=true&sort=id&fields=${encodeURIComponent(DEST_FIELDS)}`,
  );
  return rows.map(toDestination);
}

export async function cmsTrips(): Promise<Trip[]> {
  const rows = await directus<Record<string, unknown>>(
    `/items/trips?limit=-1&filter[published][_eq]=true&sort=id&fields=${encodeURIComponent(TRIP_FIELDS)}`,
  );
  return rows.map(toTrip);
}
