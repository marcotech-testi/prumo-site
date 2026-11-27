import { expect, test } from "@playwright/test";
import { publicRoutes } from "./routes";

for (const route of publicRoutes) {
  test(`página ${route}: 200, um único H1, sem imagens sem alt`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("img:not([alt])")).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  });
}

test("FAQ abre e fecha pelo teclado", async ({ page }) => {
  await page.goto("/perguntas-frequentes");
  const q = page.getByRole("button", { name: "Quanto custa um jardim vertical em Curitiba?" });
  await q.focus();
  await page.keyboard.press("Enter");
  await expect(q).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Portais genéricos misturam")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(q).toHaveAttribute("aria-expanded", "false");
});

test("bloco de preço não aparece", async ({ page }) => {
  await page.goto("/jardim-vertical");
  await expect(page.getByText("Faixa de referência")).toHaveCount(0);
  await expect(page.getByText(/R\$/)).toHaveCount(0);
});
