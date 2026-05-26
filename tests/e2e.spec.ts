import { expect, test } from "@playwright/test";

test("hero trace, route lab, history, and no-quote surfaces work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Turn one live quote/i })).toBeVisible();
  await page.getByRole("link", { name: /Trace a live intent/i }).click();

  await expect(page.getByRole("heading", { name: /Run the live quote path/i })).toBeVisible();
  await page.getByRole("button", { name: /Trace a live intent/i }).click();
  await expect(page.getByText(/Quote received|No eligible quote/i).first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/quoteId/i).first()).toBeVisible();
  await page.getByRole("button", { name: /Copy explanation/i }).click();
  await expect(page.getByText(/Copied/i)).toBeVisible();

  await page.goto("/app/routes");
  await expect(page.getByRole("heading", { name: /Live route inventory/i })).toBeVisible();
  await expect(page.getByText(/routes/i).first()).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: /Refresh routes/i }).click();
  await expect(page.getByText(/solver lens/i)).toBeVisible();

  await page.goto("/app/traces");
  await expect(page.getByRole("heading", { name: /Trace history/i })).toBeVisible();
  await expect(page.getByText(/production-quote/i).first()).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: /Copy text/i }).click();
  await expect(page.getByRole("button", { name: /Copied/i })).toBeVisible();

  await page.goto("/app/playground");
  await expect(page.getByRole("heading", { name: /Explain an empty quote array/i })).toBeVisible();
  await page.getByRole("button", { name: /Run no-quote scenario/i }).click();
  await expect(page.getByText(/quotes/i).first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/selected amount may sit outside active route ranges/i)).toBeVisible();
});
