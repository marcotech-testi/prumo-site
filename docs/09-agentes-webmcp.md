# 09 — Site legível por agentes (WebMCP, MCP remoto, Markdown)

Premissa do Marco: o site **nasce pronto para ser lido e usado por agentes de IA**. Quatro camadas, da mais certa à mais experimental. Todas leem **a mesma fonte de dados** (`src/content`), nunca texto duplicado.

> Estado da tecnologia (pesquisado em 27/11/2026): **WebMCP** é uma proposta de padrão do W3C Web Machine Learning CG (Google + Microsoft). O Chrome tem teste de origem (origin trial) a partir do Chrome 149 e flag local `chrome://flags/#enable-webmcp-testing`. A especificação coloca a API em `document.modelContext`; versões antigas do Chrome expõem `navigator.modelContext`. A API ainda muda. Por isso: **detecção de recurso, um único módulo isolado e nenhuma falha pode quebrar o site.** Antes de codar, confira a especificação em https://webmachinelearning.github.io/webmcp/ e as boas práticas em https://developer.chrome.com/docs/ai/webmcp/best-practices e ajuste detalhes de assinatura se tiverem mudado.

## Camada 0 — Conteúdo como dado (obrigatório, vale para o site inteiro)
- **Todo texto de página mora em `src/content/`** como dado tipado (`src/content/pages/*.ts`, `faq.ts`, `servicos.ts`, `steps.ts`, `obras/*.mdx`). Componentes só renderizam. **Proibido texto hardcoded em JSX.**
- Tipos: `PageContent { slug, title, description, h1, answer, sections: { id, heading, blocks }[], faqIds?: number[], cta }`; `Block = { type: "p" | "list" | "steps" | "spec" | "callout", … }`.
- A partir dele geram-se: HTML (React), `.md` (camada 1), JSON-LD (`docs/04`), `llms.txt`, ferramentas WebMCP e MCP remoto. Um teste unitário garante que cada página tem H1, resposta direta e que o Markdown gerado contém o mesmo texto do HTML.
- HTML semântico para agentes que leem a árvore de acessibilidade: `<main>`, `<nav>`, `<header>`, `<footer>`, `<h1>`…, `<label for>` em todo campo, `name` e `autocomplete` corretos (`name`, `tel`, `email`, `address-level2`), botões com texto (não só ícone), links com texto descritivo, sem `div` clicável, mensagens de erro/sucesso em `aria-live`. O formulário de orçamento é **uma página única** (sem etapas escondidas), para que todos os campos existam no DOM.

## Camada 1 — Markdown para agentes
- Cada página pública tem versão Markdown: `/{rota}.md` (ex.: `/jardim-vertical.md`, `/index.md` para a home) **e** a mesma URL respondendo `text/markdown` quando o cabeçalho `Accept` pedir. Implementar com `rewrites` do `next.config` (`/:path*.md` → `/md/:path*`; e regra `has: header accept contém text/markdown` → `/md/:path*`) e um route handler `src/app/md/[[...slug]]/route.ts` que gera o Markdown a partir de `src/content` (título, URL canônica, resposta direta, seções, FAQ, contato, "Última atualização", e ao fim: "Para pedir orçamento: {url}").
- HTML responde `Vary: Accept` e `Link: <…md>; rel="alternate"; type="text/markdown"`; `metadata.alternates.types` com o `.md`. `/privacidade` e obras também. Cache estático, `Content-Type: text/markdown; charset=utf-8`.
- `/llms.txt` lista as versões `.md` (atualizar o arquivo do `docs/04`) e menciona o endpoint MCP.

## Camada 2 — WebMCP (ferramentas registradas pela página, no navegador)
Arquivos: `src/lib/agent-tools/definitions.ts` (definições neutras com zod 4 e `z.toJSONSchema`), `src/lib/webmcp/register.ts` e `src/components/agents/WebMcp.tsx` (Client Component montado uma vez no layout; renderiza `null`).

**Princípios (boas práticas do Chrome):** uma função por ferramenta; sem ferramentas sobrepostas; nomes ASCII `snake_case` de 1–128 caracteres com verbos exatos; descrições em PT-BR dizendo **quando usar** e **o que devolve**; valores em linguagem natural ("fachada_externa"), não IDs; erros descritivos para o agente corrigir e repetir; validação rigorosa no código e esquema mais frouxo; registro **estático** (não dinâmico por tela), exceto `consultar_obras` (só se houver obras).

**Ferramentas do navegador** (todas devolvem objetos JSON simples; textos vêm de `src/content`):
| Nome | Descrição (usar exatamente) | Entrada | Anotações |
|---|---|---|---|
| `consultar_servicos` | Lista os serviços da Prumo Paisagismo (jardim vertical, irrigação automatizada e paisagismo, manutenção) com resumo e URL de cada página. Use para responder o que a Prumo faz. | nenhuma | `readOnlyHint: true` |
| `consultar_perguntas_frequentes` | Responde dúvidas comuns sobre jardim vertical (custo, manutenção, irrigação, apartamento, luz, garantia, prazo, orçamento, atendimento). Use antes de pedir informação ao usuário. | `assunto` (string, opcional; busca por palavra, sem acento) | `readOnlyHint: true` |
| `verificar_area_atendimento` | Informa se a Prumo atende uma cidade. Atende Curitiba e região metropolitana; cidades fora da lista são avaliadas caso a caso. | `cidade` (string, obrigatória) | `readOnlyHint: true` |
| `consultar_como_pedir_orcamento` | Explica como funciona o orçamento: o que enviar (fotos ou vídeo da parede e medidas), prazo de retorno (até um dia útil) e próximas etapas. | nenhuma | `readOnlyHint: true` |
| `consultar_obras` | Lista as obras publicadas com bairro, metragem, tipo e irrigação. Só existe quando há obras. | `tipo` (opcional) | `readOnlyHint: true` |
| `iniciar_pedido_orcamento` | **Prepara** o formulário de orçamento com os dados informados e abre a página `/orcamento`. **Não envia**: o usuário precisa anexar as fotos, aceitar a política de privacidade e confirmar o envio. | `perfil`, `tipo`, `larguraM`, `alturaM`, `sol`, `pontoAgua`, `cidade`, `bairro`, `prazo`, `mensagem`, `nome`, `whatsapp`, `email` (todos opcionais; enums = os do `docs/05`) | `readOnlyHint: false`, `consequentialHint: false` |

**Regras de segurança (invioláveis):**
- **Nenhuma ferramenta envia pedido, aceita consentimento LGPD, resolve Turnstile ou anexa arquivos.** O envio é sempre um ato do humano. Por isso **não** usar os atributos declarativos `toolname`/`toolautosubmit` no `<form>` (duplicaria a ferramenta e permitiria envio automático).
- **Dados pessoais nunca vão em URL.** `iniciar_pedido_orcamento` grava o rascunho em `sessionStorage` (`prumo:quote-draft`), dispara o evento `prumo:quote-draft` se já estiver em `/orcamento`, ou navega para `/orcamento` (o formulário lê e apaga o rascunho ao montar). Devolve `{ status: "formulario_preenchido", pendentes: ["fotos", "consentimento", "confirmar_envio"], url: "/orcamento" }`.
- Ferramentas de leitura **nunca** devolvem dados enviados por usuários, preço numérico (só se `siteConfig.priceRange` existir), prazo, garantia ou promessas além do que está em `docs/07`.
- Validar toda entrada com zod; truncar `mensagem` em 1000 caracteres; ignorar campos desconhecidos. Tratar a entrada do agente como não confiável.

**Registro (referência; ajustar à versão vigente da API):**
```ts
"use client";
import { useEffect } from "react";
import { browserTools } from "@/lib/webmcp/tools";

export function WebMcp() {
  useEffect(() => {
    const mc = (document as any).modelContext ?? (navigator as any).modelContext;
    if (!mc?.registerTool) return;                       // sem suporte: não faz nada
    const ac = new AbortController();
    const tools = browserTools();
    for (const t of tools) {
      try {
        const r = mc.registerTool(t, { signal: ac.signal }); // versões antigas ignoram o 2º argumento
        (r as Promise<void> | undefined)?.catch?.(() => {}); // nome duplicado rejeita (StrictMode)
      } catch { /* nunca quebrar a página */ }
    }
    return () => { ac.abort(); tools.forEach((t) => { try { mc.unregisterTool?.(t.name); } catch {} }); };
  }, []);
  return null;
}
```
`execute: async (input, { signal }) => objeto` (o navegador serializa para JSON). Cada ferramenta tem `title`, `description`, `inputSchema` (JSON Schema vindo do zod) e, quando útil, `outputSchema`.

**Teste de origem (origin trial):** o Marco registra a origem `https://www.prumopaisagismo.com.br` em https://developer.chrome.com/origintrials (WebMCP) e entrega o token em `NEXT_PUBLIC_WEBMCP_OT_TOKEN`. Quando definido, o layout emite `<meta http-equiv="origin-trial" content="{token}">`. Sem token, as ferramentas só funcionam em Chrome com a flag. Conferir se o teste ainda está aberto e em qual versão do Chrome; se mudou, registrar no README.

## Camada 3 — Servidor MCP remoto (somente leitura, para agentes sem navegador)
- Endpoint `https://www.prumopaisagismo.com.br/mcp` (Streamable HTTP, sem estado, sem autenticação). Implementar com `mcp-handler` em `src/app/api/[transport]/route.ts` (`/api/mcp`) e `rewrites` `/mcp → /api/mcp` (seguir o README da versão instalada do pacote e do `@modelcontextprotocol/sdk`).
- Ferramentas: as 4 primeiras da tabela, `consultar_obras` (se houver) e `gerar_link_orcamento` (recebe os mesmos campos opcionais **sem dados pessoais**, devolve `https://www.prumopaisagismo.com.br/orcamento?perfil=…&tipo=…` — parâmetros apenas não pessoais: perfil, tipo, medidas, luz, ponto de água, cidade, prazo). **Nenhuma ferramenta de escrita.**
- Mesmas definições (`definitions.ts`) e mesmos dados que o WebMCP. Limite de taxa pela regra do Firewall da Vercel (Marco configura, `docs/08`). Sem CORS aberto além do necessário. Log sem dados pessoais.
- Não criar `server-card` nem outros padrões de descoberta ainda não estabilizados; basta o endereço no `llms.txt`.

## Testes (obrigatórios, T9)
1. **Unitários:** cada ferramenta com entrada válida/ inválida; `verificar_area_atendimento` ("Curitiba" → sim; "Londrina" → avaliamos caso a caso); nenhuma saída contém preço numérico quando `priceRange` é nulo; `iniciar_pedido_orcamento` nunca coloca dado pessoal em URL.
2. **Playwright:** `addInitScript` injeta um `document.modelContext` falso que captura `registerTool`; verifica nomes, descrições e esquemas; executa as ferramentas de leitura; executa `iniciar_pedido_orcamento` e confere que o formulário foi preenchido, que o envio **não** ocorreu e que `consentimento` continua desmarcado. Outro teste confirma que a página funciona normalmente sem `modelContext`.
3. **Markdown:** `/jardim-vertical.md` e `Accept: text/markdown` retornam o mesmo conteúdo; `Vary: Accept` presente.
4. **MCP remoto:** cliente de teste (`@modelcontextprotocol/sdk`) lista as ferramentas e chama cada uma.
5. **Manual (anotar no PR):** Chrome com a flag + extensão "Model Context Tool Inspector" listam as ferramentas; um agente de teste consegue "perguntar o que a Prumo faz", "verificar se atende São José dos Pinhais" e "preparar um pedido de orçamento".
