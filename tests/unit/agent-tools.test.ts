import { describe, expect, it } from "vitest";
import {
  allTools,
  gerarLinkOrcamento,
  inputJsonSchema,
  runTool,
  toolsFor,
  type ToolDefinition,
} from "@/lib/agent-tools/definitions";

const ctx = { obras: [], siteUrl: "https://www.prumopaisagismo.com.br" };
const byName = (name: string) => allTools(ctx).find((t) => t.name === name)!;
const run = (name: string, input: unknown = {}) => runTool(byName(name), input, ctx);

describe("ferramentas de agentes", () => {
  it("nomes ASCII snake_case, descrições e esquemas JSON", () => {
    for (const t of allTools(ctx)) {
      expect(t.name).toMatch(/^[a-z_]{1,128}$/);
      expect(t.description.length).toBeGreaterThan(30);
      expect(inputJsonSchema(t).type).toBe("object");
    }
  });

  it("sem obras, consultar_obras não existe", () => {
    expect(allTools(ctx).map((t) => t.name)).not.toContain("consultar_obras");
    expect(
      allTools({
        obras: [
          {
            slug: "a",
            titulo: "A",
            bairro: "B",
            cidade: "C",
            tipo: "Muro",
            metragemM2: 5,
            irrigacao: "x",
          },
        ],
      }).map((t) => t.name),
    ).toContain("consultar_obras");
  });

  it("superfícies: WebMCP prepara pedido; MCP só gera link", () => {
    expect(toolsFor("webmcp", ctx).map((t) => t.name)).toContain("iniciar_pedido_orcamento");
    expect(toolsFor("webmcp", ctx).map((t) => t.name)).not.toContain("gerar_link_orcamento");
    expect(toolsFor("mcp", ctx).map((t) => t.name)).not.toContain("iniciar_pedido_orcamento");
    expect(toolsFor("mcp", ctx).every((t) => t.readOnly)).toBe(true);
  });

  it("consultar_servicos lista os 3 serviços com URL", () => {
    const r = run("consultar_servicos") as { servicos: { url: string }[] };
    expect(r.servicos).toHaveLength(3);
    expect(r.servicos[0].url).toBe("https://www.prumopaisagismo.com.br/jardim-vertical");
  });

  it("verificar_area_atendimento: Curitiba sim, Londrina caso a caso, sem acento funciona", () => {
    expect(run("verificar_area_atendimento", { cidade: "Curitiba" }).atende).toBe("sim");
    expect(run("verificar_area_atendimento", { cidade: "sao jose dos pinhais" }).atende).toBe(
      "sim",
    );
    const l = run("verificar_area_atendimento", { cidade: "Londrina" });
    expect(l.atende).toBe("caso_a_caso");
    expect(l.mensagem).toContain("avaliamos caso a caso");
  });

  it("entrada inválida devolve erro descritivo", () => {
    const r = run("verificar_area_atendimento", {});
    expect(r.erro).toBe("Entrada inválida");
    expect((r.detalhes as string[])[0]).toMatch(/cidade/);
  });

  it("consultar_perguntas_frequentes filtra sem acento", () => {
    const r = run("consultar_perguntas_frequentes", { assunto: "irrigacao" }) as {
      perguntas: { pergunta: string }[];
    };
    expect(r.perguntas.some((p) => p.pergunta.includes("irrigação automatizada"))).toBe(true);
    expect(r.perguntas.length).toBeLessThan(12);
    const all = run("consultar_perguntas_frequentes") as { perguntas: unknown[] };
    expect(all.perguntas).toHaveLength(12);
  });

  it("nenhuma saída contém preço numérico (priceRange nulo)", () => {
    for (const t of allTools(ctx)) {
      const out = JSON.stringify(
        runTool(t, t.name === "verificar_area_atendimento" ? { cidade: "Curitiba" } : {}, ctx),
      );
      expect(out, t.name).not.toMatch(/R\$\s?\d/);
    }
  });

  it("gerar_link_orcamento: só parâmetros não pessoais, ignora campos desconhecidos", () => {
    const r = runTool(
      gerarLinkOrcamento as ToolDefinition,
      {
        perfil: "arquiteto",
        tipo: "varanda",
        larguraM: 3,
        cidade: "Pinhais",
        nome: "Ana",
        whatsapp: "41999990000",
        email: "a@b.com",
      },
      ctx,
    ) as { url: string };
    const u = new URL(r.url);
    expect(u.pathname).toBe("/orcamento");
    expect(u.searchParams.get("perfil")).toBe("arquiteto");
    expect(u.searchParams.get("larguraM")).toBe("3");
    for (const k of ["nome", "whatsapp", "email"]) expect(u.searchParams.has(k)).toBe(false);
  });

  it("iniciar_pedido_orcamento nunca coloca dado pessoal em URL e não envia", () => {
    const r = run("iniciar_pedido_orcamento", {
      nome: "Ana",
      whatsapp: "41999990000",
      mensagem: "x".repeat(5000),
    });
    expect(r).toEqual({
      status: "formulario_preenchido",
      pendentes: ["fotos", "consentimento", "confirmar_envio"],
      url: "/orcamento",
    });
  });
});
