import { expect, test, type Page } from "@playwright/test";

const png = {
  name: "parede.png",
  mimeType: "image/png",
  buffer: Buffer.from("89504e470d0a1a0a", "hex"),
};

async function fillValid(page: Page) {
  await page.getByLabel("Proprietário(a)").check();
  await page.getByLabel("Onde será o jardim").selectOption("parede_interna");
  await page.getByLabel("Largura (m)").fill("4,5");
  await page.getByLabel("Altura (m)").fill("2,8");
  await page.getByLabel("Luz na parede").selectOption("meia_sombra");
  await page.getByRole("radio", { name: "Sim" }).check();
  await page.getByLabel("Fotos ou vídeo da parede").setInputFiles(png);
  await page.locator("input[name=nome]").fill("Teste Automático");
  await page.getByLabel("WhatsApp").fill("41999990000");
  await page.locator("input[name=cidade]").fill("Curitiba");
  await page.locator("input[name=bairro]").fill("Batel");
  await page.getByRole("checkbox", { name: /Concordo com o uso/ }).check();
}

test.describe("orçamento", () => {
  test("envio completo mostra sucesso", async ({ page }) => {
    await page.goto("/orcamento?utm_source=teste");
    await fillValid(page);
    await expect(page.getByLabel("WhatsApp")).toHaveValue("(41) 99999-0000");
    await page.waitForTimeout(4200); // tempo mínimo de preenchimento
    const response = page.waitForResponse("**/api/orcamento");
    await page.getByRole("button", { name: "Enviar pedido de orçamento" }).click();
    expect((await (await response).json()).ok).toBe(true);
    await expect(page.getByRole("heading", { name: "Pedido recebido." })).toBeVisible();
  });

  test("validação: erros junto aos campos e foco no primeiro", async ({ page }) => {
    await page.goto("/orcamento");
    await page.getByRole("button", { name: "Enviar pedido de orçamento" }).click();
    await expect(page.getByText("Escolha uma opção.").first()).toBeVisible();
    await expect(page.getByLabel("Proprietário(a)")).toBeFocused();
    await expect(page.getByText("É preciso concordar para enviar o pedido.")).toBeVisible();
  });

  test("arquivo fora do limite é recusado no navegador", async ({ page }) => {
    await page.goto("/orcamento");
    await page.getByLabel("Fotos ou vídeo da parede").setInputFiles({
      name: "documento.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF"),
    });
    await expect(page.getByText(/não é um formato aceito/)).toBeVisible();
  });

  test("perfil vem da URL e o pedido não sai sem consentimento", async ({ page }) => {
    await page.goto("/orcamento?perfil=arquiteto");
    await expect(page.getByLabel("Arquiteto(a) ou designer")).toBeChecked();
  });

  test("API: honeypot e envio rápido recebem 200 silencioso", async ({ request }) => {
    const pass = await (
      await request.post("/api/orcamento/passe", {
        data: { turnstileToken: "XXXX.DUMMY.TOKEN.XXXX" },
      })
    ).json();
    const base = {
      schemaVersion: 1,
      campos: {
        perfil: "cliente",
        tipo: "varanda",
        naoSeiMedidas: true,
        sol: "nao_sei",
        pontoAgua: "nao_sei",
        nome: "Robô",
        whatsapp: "41999990000",
        cidade: "Curitiba",
        bairro: "Centro",
        consentimento: true,
      },
      arquivos: [
        {
          url: "http://localhost/__local-blob/x.png",
          nome: "x.png",
          tipo: "image/png",
          tamanhoBytes: 10,
        },
      ],
      origem: {},
      passe: pass.passe,
    };
    const bot = await request.post("/api/orcamento", {
      data: { ...base, website: "spam", renderedAt: 0 },
    });
    expect(bot.status()).toBe(200);
    expect((await bot.json()).id).toBe("pq_ok");
    const fast = await request.post("/api/orcamento", {
      data: { ...base, renderedAt: Date.now() },
    });
    expect((await fast.json()).id).toBe("pq_ok");
  });

  test("API: arquivo de host externo é recusado no servidor", async ({ request }) => {
    const pass = await (
      await request.post("/api/orcamento/passe", {
        data: { turnstileToken: "XXXX.DUMMY.TOKEN.XXXX" },
      })
    ).json();
    const res = await request.post("/api/orcamento", {
      data: {
        schemaVersion: 1,
        campos: {
          perfil: "cliente",
          tipo: "varanda",
          naoSeiMedidas: true,
          sol: "nao_sei",
          pontoAgua: "nao_sei",
          nome: "Pessoa",
          whatsapp: "41999990000",
          cidade: "Curitiba",
          bairro: "Centro",
          consentimento: true,
        },
        arquivos: [
          {
            url: "https://evil.example.com/x.png",
            nome: "x.png",
            tipo: "image/png",
            tamanhoBytes: 10,
          },
        ],
        origem: {},
        renderedAt: 0,
        passe: pass.passe,
      },
    });
    expect(res.status()).toBe(400);
  });

  test("formulário inteiro por teclado: todos os campos alcançáveis com Tab", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "teclado só no desktop");
    await page.goto("/orcamento");
    await page.getByLabel("Proprietário(a)").focus();
    const reached = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const name = await page.evaluate(
        () => (document.activeElement as HTMLInputElement | null)?.name ?? "",
      );
      if (name) reached.add(name);
      await page.keyboard.press("Tab");
    }
    for (const n of [
      "perfil",
      "tipo",
      "larguraM",
      "alturaM",
      "naoSeiMedidas",
      "sol",
      "pontoAgua",
      "fotos",
      "prazo",
      "mensagem",
      "nome",
      "whatsapp",
      "email",
      "cidade",
      "bairro",
      "consentimento",
    ]) {
      expect(reached, n).toContain(n);
    }
    expect(reached).not.toContain("website");
  });
});
