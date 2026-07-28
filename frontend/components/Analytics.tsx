import Script from "next/script";

/**
 * Privacy-friendly analytics. Renders nothing unless configured, so local dev and
 * previews stay clean.
 *
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=dacantour.com   → self-host/Plausible cloud
 *
 * (Vercel Analytics can be added separately with @vercel/analytics if you deploy
 * to Vercel — no cookie banner needed for either.)
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

  if (!domain) return null;

  return <Script defer data-domain={domain} src={src} strategy="afterInteractive" />;
}
