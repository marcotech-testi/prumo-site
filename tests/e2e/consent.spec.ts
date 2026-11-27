import { expect, test } from "@playwright/test";

const thirdParty = /googletagmanager|google-analytics|facebook\.net|facebook\.com/;

test("recusar não carrega nenhum script de terceiros", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (r) => {
    if (thirdParty.test(r.url())) requests.push(r.url());
  });
  await page.goto("/");
  await page
    .getByRole("region", { name: "Cookies" })
    .getByRole("button", { name: "Recusar" })
    .click();
  await page.goto("/jardim-vertical");
  await page.waitForTimeout(1500);
  expect(requests).toEqual([]);
  await expect(
    page.locator('script[src*="googletagmanager"], script[src*="fbevents"]'),
  ).toHaveCount(0);
});

test("aceitar persiste a escolha", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("region", { name: "Cookies" })
    .getByRole("button", { name: "Aceitar" })
    .click();
  await page.reload();
  await expect(page.getByRole("region", { name: "Cookies" })).toBeHidden();
  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name === "prumo_consent")?.value).toContain("granted");
});

test("privacidade mostra o controlador (fallback Prumo Paisagismo)", async ({ page }) => {
  await page.goto("/privacidade");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Política de Privacidade e Cookies",
  );
  await expect(page.getByText("{{CONTROLADOR}}")).toHaveCount(0);
  await expect(page.getByText(/operado por Prumo Paisagismo/)).toBeVisible();
});
