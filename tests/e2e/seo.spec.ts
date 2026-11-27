import { expect, test } from "@playwright/test";

test.describe("SEO fora de produção", () => {
  test("noindex no cabeçalho e na meta; robots bloqueia tudo", async ({ request, page }) => {
    const res = await request.get("/jardim-vertical");
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
    await page.goto("/jardim-vertical");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \//);
  });

  test("Markdown por .md e por Accept entregam o mesmo conteúdo", async ({ request }) => {
    const a = await request.get("/jardim-vertical.md");
    const b = await request.get("/jardim-vertical", { headers: { Accept: "text/markdown" } });
    expect(a.headers()["content-type"]).toContain("text/markdown");
    expect(await a.text()).toBe(await b.text());
    expect((await request.get("/index.md")).status()).toBe(200);
  });

  test("HTML anuncia a versão Markdown", async ({ request }) => {
    const res = await request.get("/sobre");
    expect(res.headers()["link"]).toContain("/sobre.md");
  });

  test("maiúsculas redirecionam para minúsculas", async ({ request }) => {
    const res = await request.get("/Jardim-Vertical", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/jardim-vertical");
  });

  test("llms.txt, manifesto e sitemap existem", async ({ request }) => {
    for (const p of ["/llms.txt", "/manifest.webmanifest", "/sitemap.xml", "/favicon.ico"]) {
      expect((await request.get(p)).status(), p).toBe(200);
    }
    const sm = await (await request.get("/sitemap.xml")).text();
    expect(sm).not.toContain("/obras");
    expect(sm).not.toContain(".md");
    expect(sm).not.toContain("_styleguide");
  });
});
