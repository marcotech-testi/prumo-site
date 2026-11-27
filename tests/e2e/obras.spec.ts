import { expect, test } from "@playwright/test";

test.describe("sem obras publicadas", () => {
  test("/obras responde 404 e não há links para obras", async ({ page }) => {
    const res = await page.goto("/obras");
    expect(res?.status()).toBe(404);
    await page.goto("/");
    await expect(page.locator('a[href^="/obras"]')).toHaveCount(0);
    await expect(page.locator("#obras")).toHaveCount(0);
  });
});
