import type { MetadataRoute } from "next";
import { getKgTrips, getUsTrips, getDestinations } from "@/lib/content";
import { abs } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [kgTrips, usTrips, destinations] = await Promise.all([
    getKgTrips(),
    getUsTrips(),
    getDestinations(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: abs("/kyrgyzstan"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/kyrgyzstan/build-your-own"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/kyrgyzstan/destinations"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/usa"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const tripRoutes: MetadataRoute.Sitemap = [
    ...kgTrips.map((t) => ({
      url: abs(`/kyrgyzstan/trips/${t.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...usTrips.map((t) => ({
      url: abs(`/usa/${t.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: abs(`/kyrgyzstan/destinations/${d.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...tripRoutes, ...destinationRoutes];
}
