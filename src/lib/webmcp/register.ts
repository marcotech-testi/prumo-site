import type { ToolContext } from "@/lib/agent-tools/definitions";
import { browserTools } from "./tools";

type ModelContext = {
  registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => Promise<void> | void;
  unregisterTool?: (name: string) => void;
};

/** API experimental: document.modelContext (spec) ou navigator.modelContext (Chrome antigo). */
export function getModelContext(): ModelContext | null {
  try {
    const mc =
      (document as unknown as { modelContext?: ModelContext }).modelContext ??
      (navigator as unknown as { modelContext?: ModelContext }).modelContext;
    return mc && typeof mc.registerTool === "function" ? mc : null;
  } catch {
    return null;
  }
}

/** Registra as ferramentas; devolve a função de limpeza. Nunca lança. */
export function registerWebMcpTools(
  ctx: ToolContext,
  navigate: (path: string) => void,
): () => void {
  const mc = getModelContext();
  if (!mc) return () => {};
  const ac = new AbortController();
  const tools = browserTools(ctx, navigate);
  for (const t of tools) {
    try {
      const r = mc.registerTool(t, { signal: ac.signal });
      (r as Promise<void> | undefined)?.catch?.(() => {}); // nome duplicado (StrictMode) rejeita
    } catch {
      /* nunca quebrar a página */
    }
  }
  return () => {
    ac.abort(); // spec atual: remover = abortar o signal
    for (const t of tools) {
      try {
        mc.unregisterTool?.(t.name); // versões antigas
      } catch {
        /* ignore */
      }
    }
  };
}
