// ---------------------------------------------------------------------------
// Content layer. The rest of the app imports from here — never directly from
// the CMS or the static file. Each getter tries Directus and, on any failure
// (CMS offline, empty, not yet seeded), falls back to the placeholder data in
// lib/data.ts. That means the site always renders, with or without Directus.
// ---------------------------------------------------------------------------
import {
  categories as staticCategories,
  destinations as staticDestinations,
  kgTrips as staticKgTrips,
  usTrips as staticUsTrips,
  type Trip,
  type Destination,
  type Category,
} from "@/lib/data";
import { cmsCategories, cmsDestinations, cmsTrips } from "@/lib/cms";

async function withFallback<T>(fetcher: () => Promise<T[]>, fallback: T[]): Promise<T[]> {
  try {
    const data = await fetcher();
    return data.length ? data : fallback;
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<Category[]> {
  return withFallback(cmsCategories, staticCategories);
}

export async function getDestinations(): Promise<Destination[]> {
  return withFallback(cmsDestinations, staticDestinations);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  return (await getDestinations()).find((d) => d.slug === slug);
}

export async function getAllTrips(): Promise<Trip[]> {
  return withFallback(cmsTrips, [...staticKgTrips, ...staticUsTrips]);
}

export async function getKgTrips(): Promise<Trip[]> {
  return (await getAllTrips()).filter((t) => t.country === "KG");
}

export async function getUsTrips(): Promise<Trip[]> {
  return (await getAllTrips()).filter((t) => t.country === "US");
}

export async function getTripBySlug(slug: string): Promise<Trip | undefined> {
  return (await getAllTrips()).find((t) => t.slug === slug);
}
