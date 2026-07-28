import { test, expect, type Page } from "@playwright/test";

/**
 * Scope queries to the form — the footer also has an "Email" link and a
 * "Message us" link, which would otherwise match the same accessible names.
 */
const form = (page: Page) => page.locator("form").first();

/**
 * The critical path: a visitor lands, browses Kyrgyzstan trips, opens one, and
 * submits an inquiry. If this breaks, the business stops getting leads.
 *
 * The API is stubbed so e2e needs no backend/database.
 */
test.describe("browse a trip → submit an inquiry", () => {
  test("completes the whole journey", async ({ page }) => {
    const requests: Array<Record<string, unknown>> = [];
    await page.route("**/api/inquiries", async (route) => {
      requests.push(JSON.parse(route.request().postData() || "{}"));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "e2e-1", ok: true }),
      });
    });

    // 1. Home
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/mountains/i);

    // 2. Into the Kyrgyzstan catalog
    await page.getByRole("link", { name: /explore kyrgyzstan trips/i }).click();
    await expect(page).toHaveURL(/\/kyrgyzstan/);
    const cards = page.locator("a[href*='/kyrgyzstan/trips/']");
    await expect(cards.first()).toBeVisible();

    // 3. Filter
    await page.getByRole("button", { name: /horse riding/i }).click();
    await expect(cards.first()).toBeVisible();

    // 4. Open a trip
    const title = await cards.first().locator("h3").innerText();
    await cards.first().click();
    await expect(page).toHaveURL(/\/kyrgyzstan\/trips\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title);

    // 5. Submit the inquiry
    const inquiry = form(page);
    await inquiry.getByLabel(/full name/i).fill("E2E Traveler");
    await inquiry.getByLabel(/^email/i).fill("e2e@example.com");
    await inquiry.getByLabel(/message/i).fill("Is this departure still open?");
    await inquiry.getByRole("button", { name: /send inquiry/i }).click();

    // 6. Success
    await expect(page.getByText(/message received/i)).toBeVisible();
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({ name: "E2E Traveler", email: "e2e@example.com" });
  });

  test("offers the WhatsApp fallback when the API is down", async ({ page }) => {
    await page.route("**/api/inquiries", (route) => route.fulfill({ status: 500, body: "{}" }));

    await page.goto("/contact");
    const contact = form(page);
    await contact.getByLabel(/full name/i).fill("E2E Traveler");
    await contact.getByLabel(/^email/i).fill("e2e@example.com");
    await contact.getByLabel(/message/i).fill("Testing the failure path");
    await contact.getByRole("button", { name: /send inquiry/i }).click();

    await expect(page.getByText(/something went wrong/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /whatsapp/i }).first()).toBeVisible();
  });

  test("submits a build-your-own request", async ({ page }) => {
    let received: Record<string, unknown> = {};
    await page.route("**/api/custom-trips", async (route) => {
      received = JSON.parse(route.request().postData() || "{}");
      await route.fulfill({ status: 201, contentType: "application/json", body: '{"ok":true}' });
    });

    await page.goto("/kyrgyzstan/build-your-own");
    const custom = form(page);
    await custom.getByLabel(/full name/i).fill("Custom Traveler");
    await custom.getByLabel(/^email/i).fill("custom@example.com");
    await custom.getByLabel(/regions or experiences/i).fill("Kel-Suu, horses");
    await custom.getByLabel(/dream trip/i).fill("Two weeks in July for four people");
    await custom.getByRole("button", { name: /send my trip idea/i }).click();

    await expect(page.getByText(/message received/i)).toBeVisible();
    expect(received.interests).toBe("Kel-Suu, horses");
  });
});
