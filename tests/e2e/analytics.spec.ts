import { expect, test, type Page } from "@playwright/test";

// Requer build com NEXT_PUBLIC_GA_ID e NEXT_PUBLIC_META_PIXEL_ID (o CI usa IDs de teste).
const configured = !!process.env.NEXT_PUBLIC_GA_ID && !!process.env.NEXT_PUBLIC_META_PIXEL_ID;
const thirdParty = /googletagmanager|google-analytics|facebook\.net|facebook\.com/;

async function stubThirdParty(page: Page) {
  const hits: string[] = [];
  await page.route(thirdParty, (route) => {
    hits.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  return hits;
}

const dataLayerEvents = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[][] }).dataLayer ?? []).map((a) =>
      Array.from(a as ArrayLike<unknown>),
    ),
  );
const fbqCalls = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { fbq?: { queue: unknown[][] } }).fbq?.queue ?? []).map((a) =>
      Array.from(a as ArrayLike<unknown>),
    ),
  );

test.describe("analytics com consentimento", () => {
  test.skip(!configured, "build sem IDs de GA4/Pixel");

  test("sem consentimento: nenhuma chamada de terceiros, mesmo com IDs configurados", async ({
    page,
  }) => {
    const hits = await stubThirdParty(page);
    await page.goto("/");
    await page.goto("/jardim-vertical");
    await page.waitForTimeout(1500);
    expect(hits).toEqual([]);
  });

  test("aceitar carrega GA4 e Pixel com Consent Mode e dispara submit_quote/Lead", async ({
    page,
  }) => {
    const hits = await stubThirdParty(page);
    await page.goto("/orcamento");
    await page
      .getByRole("region", { name: "Cookies" })
      .getByRole("button", { name: "Aceitar" })
      .click();
    await expect
      .poll(() => hits.some((h) => h.includes("googletagmanager.com/gtag/js")))
      .toBe(true);
    await expect.poll(() => hits.some((h) => h.includes("fbevents.js"))).toBe(true);
    const dl = await dataLayerEvents(page);
    expect(dl.find((a) => a[0] === "consent" && a[1] === "default")?.[2]).toMatchObject({
      analytics_storage: "denied",
    });
    expect(dl.find((a) => a[0] === "consent" && a[1] === "update")?.[2]).toMatchObject({
      analytics_storage: "granted",
    });
    expect(dl.some((a) => a[0] === "config")).toBe(true);
    expect((await fbqCalls(page)).some((a) => a[0] === "init")).toBe(true);

    // Pedido completo → submit_quote (sem dados pessoais) e Lead.
    await page.getByLabel("Proprietário(a)").check();
    await page.getByLabel("Onde será o jardim").selectOption("varanda");
    await page.getByLabel("Não sei as medidas").check();
    await page.getByLabel("Luz na parede").selectOption("sombra");
    await page.getByRole("radio", { name: "Não sei" }).check();
    await page.getByLabel("Fotos ou vídeo da parede").setInputFiles({
      name: "p.png",
      mimeType: "image/png",
      buffer: Buffer.from("89504e47", "hex"),
    });
    await page.locator("input[name=nome]").fill("Teste Analytics");
    await page.getByLabel("WhatsApp").fill("41999990000");
    await page.locator("input[name=cidade]").fill("Curitiba");
    await page.locator("input[name=bairro]").fill("Centro");
    await page.getByRole("checkbox", { name: /Concordo com o uso/ }).check();
    await page.waitForTimeout(4200);
    await page.getByRole("button", { name: "Enviar pedido de orçamento" }).click();
    await expect(page.getByRole("heading", { name: "Pedido recebido." })).toBeVisible();
    const after = await dataLayerEvents(page);
    const submit = after.find((a) => a[0] === "event" && a[1] === "submit_quote");
    expect(submit?.[2]).toEqual({ perfil: "cliente", tipo_espaco: "varanda" });
    expect(after.some((a) => a[0] === "event" && a[1] === "start_quote")).toBe(true);
    expect(JSON.stringify(after)).not.toContain("Teste Analytics");
    expect((await fbqCalls(page)).some((a) => a[0] === "track" && a[1] === "Lead")).toBe(true);
  });
});
