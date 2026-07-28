import type { MetadataRoute } from "next";
import { abs, SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Keep preview/staging deployments out of search results.
  const isProduction =
    process.env.NEXT_PUBLIC_SITE_URL === SITE.url && process.env.NODE_ENV === "production";

  return {
    rules: isProduction
      ? [{ userAgent: "*", allow: "/" }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: abs("/sitemap.xml"),
    host: SITE.url,
  };
}
