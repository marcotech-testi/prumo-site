import { siteConfig } from "@/content/site";
import { absoluteUrl } from "./seo";

/** Conteúdo do /llms.txt (docs/04, atualizado pelo docs/09). */
export function llmsTxt() {
  const u = absoluteUrl;
  const areas = siteConfig.areaServed.filter((c) => c !== "Fazenda Rio Grande").join(", ");
  return `# Prumo Paisagismo
> Jardins verticais e paisagismo com irrigação automatizada em Curitiba e região metropolitana (PR). Projeto, execução, irrigação automatizada e manutenção, com orçamento online.

## Serviços
- [Jardim vertical](${u("/jardim-vertical")}): jardim vertical natural com irrigação automatizada para casas, apartamentos e fachadas.
- [Irrigação automatizada e paisagismo](${u("/irrigacao-automatizada-e-paisagismo")}): controlador programável e gotejamento; paisagismo sob consulta.
- [Manutenção de jardim vertical](${u("/manutencao-de-jardim-vertical")}): plano mensal com visita técnica e registro.
- [Para arquitetos](${u("/para-arquitetos")}): especificação, execução e pós-obra.

## Versões em Markdown e acesso por agentes
- Cada página tem versão Markdown: acrescente \`.md\` à URL (ex.: ${u("/jardim-vertical.md")}) ou envie \`Accept: text/markdown\`.
- [Início (Markdown)](${u("/index.md")})
- [Jardim vertical (Markdown)](${u("/jardim-vertical.md")})
- [Irrigação automatizada e paisagismo (Markdown)](${u("/irrigacao-automatizada-e-paisagismo.md")})
- [Manutenção de jardim vertical (Markdown)](${u("/manutencao-de-jardim-vertical.md")})
- [Perguntas frequentes (Markdown)](${u("/perguntas-frequentes.md")})
- Servidor MCP somente leitura: ${u("/mcp")} (serviços, perguntas frequentes, área de atendimento, como pedir orçamento).
- A página também expõe ferramentas WebMCP no navegador (ver /orcamento).

## Como pedir orçamento
- [Orçamento online](${u("/orcamento")}): envie fotos e medidas; retorno com faixa de investimento em até um dia útil.
- [Perguntas frequentes](${u("/perguntas-frequentes")})

## Contato
${siteConfig.email} · Área de atuação: ${areas} e região metropolitana.
`;
}
