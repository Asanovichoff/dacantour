import { test, expect } from "@playwright/test";

/** Every key page renders, is titled, and exposes valid SEO metadata. */
const pages = [
  { path: "/", heading: /mountains/i },
  { path: "/kyrgyzstan", heading: /trips through kyrgyzstan/i },
  { path: "/kyrgyzstan/destinations", heading: /destinations/i },
  { path: "/kyrgyzstan/build-your-own", heading: /dream/i },
  { path: "/usa", heading: /america/i },
  { path: "/about", heading: /central asia|story|road trips/i },
  { path: "/contact", heading: /plan something/i },
  { path: "/privacy", heading: /privacy policy/i },
  { path: "/terms", heading: /terms/i },
];

test.describe("site health", () => {
  for (const { path, heading } of pages) {
    test(`${path} renders with a title and h1`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
      await expect(page).toHaveTitle(/dacan tour/i);
    });
  }

  test("unknown URLs show the branded 404", async ({ page }) => {
    await page.goto("/definitely-not-a-page");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/off the trail/i);
  });

  test("trip pages expose TouristTrip structured data", async ({ page }) => {
    await page.goto("/kyrgyzstan");
    await page.locator("a[href*='/kyrgyzstan/trips/']").first().click();

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = blocks.map((b) => JSON.parse(b));
    const trip = parsed.find((d) => d["@type"] === "TouristTrip");

    expect(trip).toBeTruthy();
    expect(trip.name).toBeTruthy();
    expect(trip.offers?.length).toBeGreaterThan(0);
    expect(parsed.some((d) => d["@type"] === "BreadcrumbList")).toBe(true);
  });

  test("sitemap and robots are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain("/kyrgyzstan/trips/");

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap:");
  });

  test("mobile menu opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile-only");
    await page.goto("/");
    await page.getByRole("button", { name: /open menu/i }).click();
    // Scope to the menu — the footer has the same links.
    await page.locator("#mobile-menu").getByRole("link", { name: "USA Trips", exact: true }).click();
    await expect(page).toHaveURL(/\/usa/);
  });

  test("keyboard users can reach content via the skip link", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop-only");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /skip to content/i })).toBeFocused();
  });
});
