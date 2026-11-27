import { createMcpHandler } from "mcp-handler";
import { runTool, toolsFor } from "@/lib/agent-tools/definitions";
import { obrasResumo } from "@/lib/agent-tools/obras-context";

export const runtime = "nodejs";

/** Servidor MCP remoto somente leitura (docs/09). Público em /mcp (rewrite). Sem estado e sem dados pessoais. */
const handler = createMcpHandler(
  (server) => {
    const ctx = { obras: obrasResumo() };
    for (const tool of toolsFor("mcp", ctx)) {
      server.registerTool(
        tool.name,
        {
          title: tool.title,
          description: tool.description,
          inputSchema: tool.input,
          annotations: { readOnlyHint: true, openWorldHint: false },
        },
        async (input: unknown) => {
          const result = runTool(tool, input, ctx);
          return {
            content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            structuredContent: result,
            isError: "erro" in result,
          };
        },
      );
    }
  },
  { serverInfo: { name: "prumo-paisagismo", version: "1.0.0" } },
);

export { handler as GET, handler as POST };
