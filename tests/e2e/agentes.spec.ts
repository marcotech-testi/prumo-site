import { expect, test } from "@playwright/test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

type Captured = {
  name: string;
  description: string;
  inputSchema: unknown;
  annotations: Record<string, boolean>;
  execute: (i: unknown) => Promise<unknown>;
};

/** document.modelContext falso que captura registerTool. */
const fakeModelContext = () => {
  const tools: Captured[] = [];
  (window as unknown as { __tools: Captured[] }).__tools = tools;
  Object.defineProperty(document, "modelContext", {
    value: {
      registerTool: (t: Captured, opts?: { signal?: AbortSignal }) => {
        if (tools.some((x) => x.name === t.name))
          return Promise.reject(new DOMException("dup", "InvalidStateError"));
        tools.push(t);
        opts?.signal?.addEventListener("abort", () => tools.splice(tools.indexOf(t), 1));
        return Promise.resolve();
      },
    },
    configurable: true,
  });
};

test.describe("WebMCP", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(fakeModelContext);
  });

  test("registra as ferramentas com descrições e esquemas", async ({ page }) => {
    await page.goto("/");
    await expect
      .poll(() =>
        page.evaluate(() =>
          (window as unknown as { __tools: Captured[] }).__tools.map((t) => t.name).sort(),
        ),
      )
      .toEqual([
        "consultar_como_pedir_orcamento",
        "consultar_perguntas_frequentes",
        "consultar_servicos",
        "iniciar_pedido_orcamento",
        "verificar_area_atendimento",
      ]);
    const meta = await page.evaluate(() =>
      (window as unknown as { __tools: Captured[] }).__tools.map((t) => ({
        name: t.name,
        d: t.description.length,
        type: (t.inputSchema as { type: string }).type,
        ro: t.annotations.readOnlyHint,
      })),
    );
    for (const m of meta) {
      expect(m.d).toBeGreaterThan(30);
      expect(m.type).toBe("object");
      expect(m.ro).toBe(m.name !== "iniciar_pedido_orcamento");
    }
  });

  test("ferramentas de leitura respondem", async ({ page }) => {
    await page.goto("/");
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { __tools: Captured[] }).__tools.length),
      )
      .toBe(5);
    const area = await page.evaluate(() =>
      (window as unknown as { __tools: Captured[] }).__tools
        .find((t) => t.name === "verificar_area_atendimento")!
        .execute({ cidade: "São José dos Pinhais" }),
    );
    expect(area).toMatchObject({ atende: "sim" });
    const servicos = (await page.evaluate(() =>
      (window as unknown as { __tools: Captured[] }).__tools
        .find((t) => t.name === "consultar_servicos")!
        .execute({}),
    )) as { servicos: unknown[] };
    expect(servicos.servicos).toHaveLength(3);
  });

  test("iniciar_pedido_orcamento preenche o formulário, não envia e não marca consentimento", async ({
    page,
  }) => {
    const posts: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST" && r.url().includes("/api/orcamento")) posts.push(r.url());
    });
    await page.goto("/jardim-vertical");
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { __tools: Captured[] }).__tools.length),
      )
      .toBe(5);
    const result = await page.evaluate(() =>
      (window as unknown as { __tools: Captured[] }).__tools
        .find((t) => t.name === "iniciar_pedido_orcamento")!
        .execute({
          perfil: "cliente",
          tipo: "varanda",
          larguraM: 3,
          alturaM: 2,
          sol: "meia_sombra",
          pontoAgua: "sim",
          nome: "Ana Agente",
          whatsapp: "41999990000",
          cidade: "Curitiba",
          bairro: "Batel",
          consentimento: true,
          fotos: ["https://example.com/x.jpg"],
        }),
    );
    expect(result).toEqual({
      status: "formulario_preenchido",
      pendentes: ["fotos", "consentimento", "confirmar_envio"],
      url: "/orcamento",
    });
    await page.waitForURL("**/orcamento");
    expect(page.url()).not.toContain("Ana");
    await expect(page.locator("input[name=nome]")).toHaveValue("Ana Agente");
    await expect(page.locator("input[name=whatsapp]")).toHaveValue("(41) 99999-0000");
    await expect(page.locator("select[name=tipo]")).toHaveValue("varanda");
    await expect(page.locator("input[name=consentimento]")).not.toBeChecked();
    await page.waitForTimeout(1000);
    expect(posts).toEqual([]);
    await expect(page.getByRole("heading", { name: "Pedido recebido." })).toHaveCount(0);
  });

  test("o formulário não expõe atributos declarativos de ferramenta", async ({ page }) => {
    await page.goto("/orcamento");
    await expect(page.locator("form[toolname], form[toolautosubmit]")).toHaveCount(0);
  });
});

test("sem modelContext o site funciona normalmente", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/orcamento");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orçamento de jardim vertical");
  expect(errors).toEqual([]);
});

test("MCP remoto: lista e chama as ferramentas", async ({ baseURL }) => {
  const client = new Client({ name: "teste-prumo", version: "1.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL(`${baseURL}/mcp`)));
  const { tools } = await client.listTools();
  expect(tools.map((t) => t.name).sort()).toEqual([
    "consultar_como_pedir_orcamento",
    "consultar_perguntas_frequentes",
    "consultar_servicos",
    "gerar_link_orcamento",
    "verificar_area_atendimento",
  ]);
  const calls: [string, Record<string, unknown>][] = [
    ["consultar_servicos", {}],
    ["consultar_perguntas_frequentes", { assunto: "manutenção" }],
    ["verificar_area_atendimento", { cidade: "Colombo" }],
    ["consultar_como_pedir_orcamento", {}],
    ["gerar_link_orcamento", { perfil: "arquiteto", tipo: "fachada_externa" }],
  ];
  for (const [name, args] of calls) {
    const r = (await client.callTool({ name, arguments: args })) as {
      content: { type: string; text: string }[];
      isError?: boolean;
    };
    expect(r.isError, name).toBeFalsy();
    expect(JSON.parse(r.content[0].text)).toBeTruthy();
  }
  await client.close();
});
