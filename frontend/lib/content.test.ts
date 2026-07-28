import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { kgTrips, usTrips, destinations, categories } from "@/lib/data";

/**
 * The content layer must never let a CMS outage break the site: every getter
 * falls back to the bundled placeholder content.
 */
describe("content layer (CMS with static fallback)", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.doUnmock("@/lib/cms");
  });

  it("falls back to static content when Directus is unreachable", async () => {
    vi.doMock("@/lib/cms", () => ({
      cmsTrips: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
      cmsDestinations: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
      cmsCategories: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    }));
    const content = await import("@/lib/content");

    expect(await content.getKgTrips()).toHaveLength(kgTrips.length);
    expect(await content.getUsTrips()).toHaveLength(usTrips.length);
    expect(await content.getDestinations()).toHaveLength(destinations.length);
    expect(await content.getCategories()).toHaveLength(categories.length);
  });

  it("falls back when the CMS returns an empty collection (not yet seeded)", async () => {
    vi.doMock("@/lib/cms", () => ({
      cmsTrips: vi.fn().mockResolvedValue([]),
      cmsDestinations: vi.fn().mockResolvedValue([]),
      cmsCategories: vi.fn().mockResolvedValue([]),
    }));
    const content = await import("@/lib/content");
    expect(await content.getKgTrips()).toHaveLength(kgTrips.length);
    expect(await content.getDestinations()).toHaveLength(destinations.length);
  });

  it("prefers CMS content when available", async () => {
    const cmsTrip = { ...kgTrips[0], slug: "cms-only-trip", title: "CMS Trip", country: "KG" as const };
    vi.doMock("@/lib/cms", () => ({
      cmsTrips: vi.fn().mockResolvedValue([cmsTrip]),
      cmsDestinations: vi.fn().mockResolvedValue([]),
      cmsCategories: vi.fn().mockResolvedValue([]),
    }));
    const content = await import("@/lib/content");

    const trips = await content.getKgTrips();
    expect(trips).toHaveLength(1);
    expect(trips[0].title).toBe("CMS Trip");
    expect(await content.getTripBySlug("cms-only-trip")).toBeDefined();
  });

  it("splits trips by country", async () => {
    vi.doMock("@/lib/cms", () => ({
      cmsTrips: vi.fn().mockRejectedValue(new Error("offline")),
      cmsDestinations: vi.fn().mockRejectedValue(new Error("offline")),
      cmsCategories: vi.fn().mockRejectedValue(new Error("offline")),
    }));
    const content = await import("@/lib/content");

    expect((await content.getKgTrips()).every((t) => t.country === "KG")).toBe(true);
    expect((await content.getUsTrips()).every((t) => t.country === "US")).toBe(true);
  });

  it("looks up trips and destinations by slug, and returns undefined for unknown ones", async () => {
    vi.doMock("@/lib/cms", () => ({
      cmsTrips: vi.fn().mockRejectedValue(new Error("offline")),
      cmsDestinations: vi.fn().mockRejectedValue(new Error("offline")),
      cmsCategories: vi.fn().mockRejectedValue(new Error("offline")),
    }));
    const content = await import("@/lib/content");

    expect(await content.getTripBySlug(kgTrips[0].slug)).toBeDefined();
    expect(await content.getDestinationBySlug(destinations[0].slug)).toBeDefined();
    expect(await content.getTripBySlug("does-not-exist")).toBeUndefined();
    expect(await content.getDestinationBySlug("does-not-exist")).toBeUndefined();
  });
});
