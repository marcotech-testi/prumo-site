/**
 * Fonte única das ferramentas para agentes (docs/09): usadas pelo WebMCP (navegador) e pelo MCP remoto.
 * Só leitura, exceto `iniciar_pedido_orcamento` (prepara o formulário; nunca envia).
 * Sem acesso a arquivos: dados de obras chegam por `ctx`. Sem preço, prazo ou garantia além do docs/07.
 */
import { z } from "zod";
import { faq } from "@/content/faq";
import { obraTipos } from "@/content/obras-schema";
import { jardimVertical, irrigacao, manutencao } from "@/content/pages";
import { orcamento } from "@/content/pages/orcamento";
import { priceText, servicos } from "@/content/servicos";
import { siteConfig } from "@/content/site";
import { steps, stepsNote } from "@/content/steps";
import { luzes, perfis, pontosAgua, prazos, tiposEspaco } from "@/lib/quote-schema";

export type ObraResumo = {
  slug: string;
  titulo: string;
  bairro: string;
  cidade: string;
  tipo: string;
  metragemM2: number;
  irrigacao: string;
};

export type ToolContext = { obras: ObraResumo[]; siteUrl?: string };

export type ToolResult = Record<string, unknown>;

export type ToolDefinition<S extends z.ZodType = z.ZodType> = {
  name: string;
  title: string;
  description: string;
  input: S;
  readOnly: boolean;
  /** Onde a ferramenta existe. */
  surfaces: ("webmcp" | "mcp")[];
  run: (input: z.output<S>, ctx: ToolContext) => ToolResult;
};

const url = (ctx: ToolContext, path: string) =>
  `${(ctx.siteUrl ?? siteConfig.url).replace(/\/$/, "")}${path}`;

/** Normaliza para busca: minúsculas, sem acento. */
export function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

const ignoreUnknown = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strip();

// Entrada do agente é não confiável: campos opcionais, validados e truncados.
const quoteDraftShape = {
  perfil: z.enum(perfis).optional(),
  tipo: z.enum(tiposEspaco).optional(),
  larguraM: z.coerce.number().min(0.5).max(60).optional(),
  alturaM: z.coerce.number().min(0.5).max(60).optional(),
  sol: z.enum(luzes).optional(),
  pontoAgua: z.enum(pontosAgua).optional(),
  cidade: z.string().max(80).optional(),
  prazo: z.enum(prazos).optional(),
};

const personalShape = {
  bairro: z.string().max(60).optional(),
  mensagem: z
    .string()
    .optional()
    .transform((v) => v?.slice(0, 1000)),
  nome: z.string().max(80).optional(),
  whatsapp: z.string().max(30).optional(),
  email: z.string().max(120).optional(),
};

const servicePages = [jardimVertical, irrigacao, manutencao];

export const consultarServicos: ToolDefinition = {
  name: "consultar_servicos",
  title: "Serviços da Prumo",
  description:
    "Lista os serviços da Prumo Paisagismo (jardim vertical, irrigação automatizada e paisagismo, manutenção) com resumo e URL de cada página. Use para responder o que a Prumo faz.",
  input: ignoreUnknown({}),
  readOnly: true,
  surfaces: ["webmcp", "mcp"],
  run: (_i, ctx) => ({
    empresa: siteConfig.name,
    descricao: siteConfig.descriptor,
    areaAtendimento: "Curitiba e região metropolitana",
    servicos: servicos.map((s) => {
      const page = servicePages.find((p) => p.path === s.href);
      return {
        nome: s.title,
        resumo: s.text,
        detalhes: page?.answer ?? null,
        url: url(ctx, s.href),
      };
    }),
    ...(siteConfig.priceRange
      ? {
          faixaDeReferencia: priceText(
            siteConfig.priceRange.minM2,
            siteConfig.priceRange.maxM2,
            siteConfig.priceRange.note,
          ),
        }
      : {}),
  }),
};

export const consultarPerguntas: ToolDefinition<
  z.ZodObject<{ assunto: z.ZodOptional<z.ZodString> }>
> = {
  name: "consultar_perguntas_frequentes",
  title: "Perguntas frequentes",
  description:
    "Responde dúvidas comuns sobre jardim vertical (custo, manutenção, irrigação, apartamento, luz, garantia, prazo, orçamento, atendimento). Use antes de pedir informação ao usuário.",
  input: ignoreUnknown({
    assunto: z
      .string()
      .max(200)
      .optional()
      .describe("Palavra ou assunto para filtrar, ex.: custo, irrigação, apartamento"),
  }) as z.ZodObject<{ assunto: z.ZodOptional<z.ZodString> }>,
  readOnly: true,
  surfaces: ["webmcp", "mcp"],
  run: ({ assunto }, ctx) => {
    const words = assunto
      ? normalize(assunto)
          .split(/\s+/)
          .filter((w) => w.length > 2)
      : [];
    const matches = words.length
      ? faq.filter((f) => {
          const hay = normalize(`${f.question} ${f.answer}`);
          return words.some((w) => hay.includes(w.replace(/s$/, "")));
        })
      : faq;
    return {
      perguntas: (matches.length ? matches : faq).map((f) => ({
        pergunta: f.question,
        resposta: f.answer,
      })),
      ...(words.length && !matches.length
        ? { aviso: "Nenhuma pergunta com esse assunto; seguem todas." }
        : {}),
      url: url(ctx, "/perguntas-frequentes"),
    };
  },
};

export const verificarArea: ToolDefinition<z.ZodObject<{ cidade: z.ZodString }>> = {
  name: "verificar_area_atendimento",
  title: "Área de atendimento",
  description:
    "Informa se a Prumo atende uma cidade. Atende Curitiba e região metropolitana; cidades fora da lista são avaliadas caso a caso.",
  input: ignoreUnknown({
    cidade: z.string().min(2).max(80).describe("Nome da cidade, ex.: São José dos Pinhais"),
  }) as z.ZodObject<{
    cidade: z.ZodString;
  }>,
  readOnly: true,
  surfaces: ["webmcp", "mcp"],
  run: ({ cidade }, ctx) => {
    const n = normalize(cidade).replace(/\s*[-/,]\s*pr$/, "");
    const hit = siteConfig.areaServed.find((c) => normalize(c) === n);
    return hit
      ? {
          cidade: hit,
          atende: "sim",
          mensagem: `Sim, a Prumo atende ${hit}, em Curitiba e região metropolitana.`,
          orcamento: url(ctx, "/orcamento"),
        }
      : {
          cidade,
          atende: "caso_a_caso",
          mensagem:
            "A Prumo atende Curitiba e região metropolitana. Se a sua cidade não está na lista, mande o pedido: avaliamos caso a caso.",
          cidadesDaLista: siteConfig.areaServed,
          orcamento: url(ctx, "/orcamento"),
        };
  },
};

export const comoPedirOrcamento: ToolDefinition = {
  name: "consultar_como_pedir_orcamento",
  title: "Como pedir orçamento",
  description:
    "Explica como funciona o orçamento: o que enviar (fotos ou vídeo da parede e medidas), prazo de retorno (até um dia útil) e próximas etapas.",
  input: ignoreUnknown({}),
  readOnly: true,
  surfaces: ["webmcp", "mcp"],
  run: (_i, ctx) => ({
    resumo: orcamento.intro,
    oQueEnviar: [
      "Fotos ou um vídeo da parede",
      "Medidas aproximadas (largura e altura)",
      "Cidade e bairro",
      "Contato (nome e WhatsApp)",
    ],
    prazoDeRetorno:
      "Em até um dia útil, em horário comercial, com uma faixa de investimento por m².",
    depoisDoPedido: orcamento.aside.steps,
    etapas: steps.map((s, i) => ({ numero: i + 1, etapa: s.title, descricao: s.text })),
    observacao: stepsNote,
    envio:
      "O pedido é enviado pela pessoa no formulário, com as fotos e o aceite da política de privacidade. Agentes podem apenas preparar o formulário.",
    url: url(ctx, "/orcamento"),
  }),
};

export const consultarObras: ToolDefinition<
  z.ZodObject<{ tipo: z.ZodOptional<z.ZodEnum<{ [K in (typeof obraTipos)[number]]: K }>> }>
> = {
  name: "consultar_obras",
  title: "Obras publicadas",
  description:
    "Lista as obras publicadas com bairro, metragem, tipo e irrigação. Só existe quando há obras.",
  input: ignoreUnknown({ tipo: z.enum(obraTipos).optional() }) as never,
  readOnly: true,
  surfaces: ["webmcp", "mcp"],
  run: ({ tipo }, ctx) => ({
    obras: ctx.obras
      .filter((o) => !tipo || o.tipo === tipo)
      .map((o) => ({ ...o, url: url(ctx, `/obras/${o.slug}`) })),
  }),
};

export const PENDENTES = ["fotos", "consentimento", "confirmar_envio"] as const;

export const iniciarPedido: ToolDefinition<
  z.ZodObject<typeof quoteDraftShape & typeof personalShape>
> = {
  name: "iniciar_pedido_orcamento",
  title: "Preparar pedido de orçamento",
  description:
    "Prepara o formulário de orçamento com os dados informados e abre a página /orcamento. Não envia: o usuário precisa anexar as fotos, aceitar a política de privacidade e confirmar o envio.",
  input: ignoreUnknown({ ...quoteDraftShape, ...personalShape }) as never,
  readOnly: false,
  surfaces: ["webmcp"],
  // A gravação do rascunho acontece no navegador (lib/webmcp/tools.ts); aqui só validamos e descrevemos.
  run: () => ({ status: "formulario_preenchido", pendentes: [...PENDENTES], url: "/orcamento" }),
};

export const gerarLinkOrcamento: ToolDefinition<z.ZodObject<typeof quoteDraftShape>> = {
  name: "gerar_link_orcamento",
  title: "Link de orçamento",
  description:
    "Gera o link da página de orçamento já com as escolhas informadas (perfil, onde será o jardim, medidas, luz, ponto de água, cidade e prazo). Não aceita nem envia dados pessoais: a pessoa abre o link, anexa as fotos e confirma.",
  input: ignoreUnknown(quoteDraftShape) as never,
  readOnly: true,
  surfaces: ["mcp"],
  run: (input, ctx) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(input))
      if (v !== undefined && v !== "") params.set(k, String(v));
    const qs = params.toString();
    return {
      url: url(ctx, `/orcamento${qs ? `?${qs}` : ""}`),
      pendentes: ["contato", ...PENDENTES],
    };
  },
};

export function allTools(ctx: ToolContext): ToolDefinition[] {
  const list: ToolDefinition[] = [
    consultarServicos,
    consultarPerguntas as never,
    verificarArea as never,
    comoPedirOrcamento,
  ];
  if (ctx.obras.length) list.push(consultarObras as never);
  list.push(iniciarPedido as never, gerarLinkOrcamento as never);
  return list;
}

export function toolsFor(surface: "webmcp" | "mcp", ctx: ToolContext) {
  return allTools(ctx).filter((t) => t.surfaces.includes(surface));
}

/** Valida a entrada e executa; erros voltam descritivos para o agente corrigir. */
export function runTool(tool: ToolDefinition, input: unknown, ctx: ToolContext): ToolResult {
  const parsed = tool.input.safeParse(input ?? {});
  if (!parsed.success) {
    return {
      erro: "Entrada inválida",
      detalhes: parsed.error.issues.map((i) => `${i.path.join(".") || "entrada"}: ${i.message}`),
    };
  }
  return tool.run(parsed.data, ctx);
}

/** JSON Schema da entrada (para WebMCP). */
export function inputJsonSchema(tool: ToolDefinition) {
  return z.toJSONSchema(tool.input, { io: "input", unrepresentable: "any" }) as Record<
    string,
    unknown
  >;
}
