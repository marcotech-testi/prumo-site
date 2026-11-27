import { expect, test } from "@playwright/test";

test.describe("layout", () => {
  test("sem WhatsApp configurado, nenhum botão de WhatsApp aparece", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href^="https://wa.me"]')).toHaveCount(0);
  });

  test("menu mobile: abre, prende o foco e fecha com Esc", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no mobile");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    const panel = page.locator("#menu-mobile");
    await expect(panel).toBeVisible();
    await expect(page.getByRole("button", { name: "Fechar" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const el = document.activeElement;
        return (
          !!el &&
          (document.getElementById("menu-mobile")?.contains(el) ||
            el.getAttribute("aria-controls") === "menu-mobile")
        );
      });
      expect(inside).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
  });

  test("404 real para rota inexistente", async ({ page }) => {
    const res = await page.goto("/rota-que-nao-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Página não encontrada.");
  });

  test("banner de cookies: recusar persiste e reabre pelo rodapé", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: "Cookies" });
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Recusar" }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(page.getByRole("region", { name: "Cookies" })).toBeHidden();
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === "prumo_consent")?.value).toContain("denied");
    await page.getByRole("button", { name: "Preferências de cookies" }).click();
    await expect(page.getByRole("region", { name: "Cookies" })).toBeVisible();
  });
});
