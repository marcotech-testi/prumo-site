/**
 * Ferramentas WebMCP do navegador, montadas a partir de lib/agent-tools/definitions.ts.
 * Formato da especificação (https://webmachinelearning.github.io/webmcp/, 24/11/2026):
 * { name, title, description, inputSchema, execute(input, { signal }), annotations }.
 */
import {
  inputJsonSchema,
  iniciarPedido,
  PENDENTES,
  runTool,
  toolsFor,
  type ToolContext,
  type ToolDefinition,
} from "@/lib/agent-tools/definitions";
import { QUOTE_DRAFT_EVENT, QUOTE_DRAFT_KEY, sanitizeDraft } from "@/lib/quote-draft";

export type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; consequentialHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown, options?: { signal?: AbortSignal }) => Promise<Record<string, unknown>>;
};

/** Grava o rascunho em sessionStorage (nunca em URL) e leva o usuário ao formulário. Não envia. */
function prepareQuote(input: unknown, navigate: (path: string) => void) {
  const result = runTool(iniciarPedido as ToolDefinition, input, { obras: [] });
  if ("erro" in result) return result;
  const parsed = (iniciarPedido as ToolDefinition).input.parse(input ?? {}) as Record<
    string,
    unknown
  >;
  const draft = sanitizeDraft(parsed);
  try {
    sessionStorage.setItem(QUOTE_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    return { erro: "Não foi possível preparar o formulário neste navegador.", url: "/orcamento" };
  }
  if (window.location.pathname === "/orcamento") {
    window.dispatchEvent(new Event(QUOTE_DRAFT_EVENT));
  } else {
    // Navega depois de devolver o resultado ao agente.
    window.setTimeout(() => navigate("/orcamento"), 50);
  }
  return { status: "formulario_preenchido", pendentes: [...PENDENTES], url: "/orcamento" };
}

export function browserTools(ctx: ToolContext, navigate: (path: string) => void): WebMcpTool[] {
  return toolsFor("webmcp", ctx).map((t) => ({
    name: t.name,
    title: t.title,
    description: t.description,
    inputSchema: inputJsonSchema(t),
    annotations: {
      readOnlyHint: t.readOnly,
      consequentialHint: false,
      untrustedContentHint: false,
    },
    execute: async (input) =>
      t.name === iniciarPedido.name ? prepareQuote(input, navigate) : runTool(t, input, ctx),
  }));
}
