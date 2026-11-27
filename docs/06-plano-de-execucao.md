# 06 — Plano de execução (tarefas em ordem)

Execute T0 → T12 em sequência. Cada tarefa é uma branch e um PR. Siga os critérios de "Pronto quando". Só pare nas tarefas marcadas **PARAR PARA REVISÃO** (abra o PR, resuma e aguarde o OK do Marco) ou nas situações de "Quando parar" do `CLAUDE.md`.

## T0 — Preparação (sem branch)
- Confirmar que está em `C:\dev\prumo-site` (fora do OneDrive), `git remote -v` aponta para `marcotech-testi/prumo-site`, Node ≥ 20 e pnpm instalados. Ler todos os documentos na ordem do `CLAUDE.md`.
- **Pronto quando:** você escreveu, em 8 linhas, o que vai construir e quais placeholders vai usar (WhatsApp, redes, razão social, obras, preço). Pode seguir sem esperar resposta.

## T1 — Fundação (`feat/t01-fundacao`)
Criar o app (`docs/03`), configurar TS estrito, ESLint, Prettier (+ plugin Tailwind), Vitest, Playwright, `.env.example` completo, `src/lib/env.ts`, `ci.yml`, `README.md` (como rodar, variáveis, deploy, DNS, contrato do webhook — este último completo na T7). Conectar o projeto à Vercel se houver acesso (`vercel link`); se não houver, deixar instruções no README e seguir.
**Pronto quando:** `pnpm dev` abre uma página em branco sem erros; `pnpm lint && pnpm typecheck && pnpm test && pnpm build` passam; CI verde no PR.

## T2 — Ativos e tokens (`feat/t02-ativos-tokens`)
Copiar ativos de `assets/` para `public/` (`docs/03`), criar `globals.css` com tokens e `@font-face` (`docs/01`), pré-carregar a fonte, `scripts/check-contrast.ts`, `scripts/build-assets.ts` (favicon `app/icon.svg`, `apple-icon.png`, `opengraph-image.png`), página `/_styleguide` (noindex, fora do sitemap, **bloqueada em produção** com `notFound()`) mostrando cores, tipografia, botões, logo e SpecSheet.
**Pronto quando:** `/_styleguide` mostra Archivo em largura normal e expandida corretamente; `pnpm check:contrast` passa; favicon e OG gerados e commitados.

## T3 — Layout e componentes (`feat/t03-layout`)
Header, Footer, StickyCTA, Button, Accordion, SpecSheet, Container, CookieBanner (apenas UI e persistência; scripts de terceiros na T9), `not-found`, `error`. Header/Footer leem `siteConfig`.
**Pronto quando:** navegação por teclado completa (menu mobile com foco preso e `Esc`); sem WhatsApp configurado os botões somem; Playwright + axe sem violações sérias nas rotas existentes.

## T4 — Home e páginas de serviço (`feat/t04-paginas`) — **PARAR PARA REVISÃO**
Implementar `/`, `/jardim-vertical`, `/irrigacao-automatizada-e-paisagismo`, `/manutencao-de-jardim-vertical`, `/para-arquitetos`, `/sobre`, `/perguntas-frequentes` com **o texto exato de `docs/07`**, armazenado **como dado tipado em `src/content/pages/*.ts`** (nunca hardcoded em JSX; ver `docs/09`, camada 0), componentes de seção que apenas renderizam, FAQ compartilhado (`src/content/faq.ts` com as 12 perguntas; páginas escolhem por índice), steps compartilhados. Bloco de preço condicional implementado e **desligado**. Comentários `// REVISAR-PARCEIRO` nos trechos marcados.
**Pronto quando:** todo o texto está em `src/content` (busca por texto de `docs/07` no JSX não encontra nada); todas as páginas renderizam sem foto; um único H1 por página com a resposta direta logo abaixo; texto idêntico ao `docs/07` (compare); Lighthouse mobile ≥ 90/95/95/100; lista de `REVISAR-PARCEIRO` no PR. O PR traz o link do preview para o Marco.

## T5 — Obras (`feat/t05-obras`)
Modelo de conteúdo MDX + validação zod (`docs/02`), `src/content/obras.ts`, ObraCard, galeria, `/obras` e `/obras/[slug]`, seção "Obras" da home, item de menu — **todos condicionais** a existir obra publicada. `_exemplo.mdx` só em desenvolvimento.
**Pronto quando:** com zero obras, `/obras` dá 404, o menu e a home não mostram nada de obras e o sitemap não lista; com a obra de exemplo habilitada em dev, a ficha técnica, a galeria e o CTA `?obra=` funcionam; teste unitário cobre a regra de publicação (autorização, ≥ 2 fotos, 1 foto de irrigação).

## T6 — Privacidade e consentimento (`feat/t06-privacidade`)
`/privacidade` com a minuta de `docs/07` (com `{{CONTROLADOR}}` vindo de `NEXT_PUBLIC_LEGAL_NAME`; se vazio, a página mostra "Prumo Paisagismo" e o build em modo estrito falha), link "Preferências de cookies" no rodapé, `lib/consent.ts` (estado, cookie `prumo_consent`, evento).
**Pronto quando:** recusar não injeta nenhum script de terceiros (verificado em teste e2e: nenhuma requisição a googletagmanager/facebook); aceitar/recusar persiste; reabrir pelo rodapé funciona.

## T7 — Orçamento (`feat/t07-orcamento`) — **PARAR PARA REVISÃO**
Implementar `/orcamento`, `QuoteForm`, `lib/quote-schema.ts`, upload (`/api/orcamento/upload`), `/api/orcamento`, e-mails (Resend), webhook assinado, antispam (Turnstile + honeypot + tempo mínimo), UTMs (`lib/utm.ts`), `README` com o contrato do webhook. Testes: unitários (schema, HMAC, utm, whatsapp) e e2e (envio feliz com Turnstile de teste e Blob/Resend em modo local, validações, honeypot, teclado).
**Pronto quando:** em dev, um pedido completo gera no console o e-mail interno e o de confirmação com todos os campos e UTMs; bots (honeypot/tempo) recebem 200 sem e-mail; arquivo fora dos limites é recusado no cliente e no servidor; e2e verde. No PR, listar as variáveis que o Marco precisa criar (`docs/08`).

## T8 — SEO e Google Search completos (`feat/t08-seo`)
Implementar **tudo** do `docs/04`: `generateMetadata` por rota (tabela), `robots` com snippets máximos, canonicals, `robots.ts`, `sitemap.ts` (com `lastmod` real e imagens de obras), `/llms.txt`, JSON-LD (`Organization`, `HomeAndConstructionBusiness`, `WebSite`, `Service`, `BreadcrumbList`, `FAQPage`) com breadcrumb visível, favicon/ícones/manifesto, meta de verificação do Google e do Bing (condicionais a variáveis), IndexNow (arquivo de chave + `scripts/indexnow.ts` + job no GitHub Actions), redirecionamentos, 404 real, `noindex` fora de produção, `scripts/check-seo.ts` (`pnpm check:seo`) no CI.
**Pronto quando:** `pnpm check:seo` verde em todas as URLs do sitemap; `view-source` de cada rota mostra title/description/canonical/OG corretos; JSON-LD válido (anotar o resultado do Rich Results Test e do Schema Markup Validator no PR); `*.vercel.app` e previews respondem `X-Robots-Tag: noindex`; Lighthouse SEO = 100.

## T9 — Agentes: Markdown, WebMCP e MCP remoto (`feat/t09-agentes`) — **PARAR PARA REVISÃO**
Implementar o `docs/09` inteiro: versões `.md` e `Accept: text/markdown`, `src/lib/agent-tools/definitions.ts` (fonte única), `WebMcp.tsx` no layout, `iniciar_pedido_orcamento` ligado ao `QuoteForm` (rascunho por `sessionStorage`, sem dados pessoais em URL, sem envio), servidor MCP remoto somente leitura em `/mcp`, atualização do `llms.txt`, todos os testes do `docs/09`.
**Pronto quando:** testes unitários, Playwright (com `modelContext` falso) e do cliente MCP verdes; o site funciona normalmente sem `modelContext`; nenhuma ferramenta consegue enviar o formulário, marcar o consentimento ou anexar arquivos; `/jardim-vertical.md` e `Accept: text/markdown` entregam o mesmo conteúdo; PR traz o roteiro de teste manual (Chrome com flag + Model Context Tool Inspector) e a lista do que o Marco precisa fazer (token do teste de origem, limite de taxa no Firewall).

## T10 — Analytics (`feat/t10-analytics`)
Vercel Analytics/Speed Insights, `components/consent/Analytics.tsx` (GA4 + Meta Pixel só com consentimento, Consent Mode v2), eventos de `docs/04`, atribuição UTM integrada ao formulário.
**Pronto quando:** sem IDs configurados nada quebra; com IDs de teste e consentimento, `page_view`, `click_whatsapp`, `submit_quote` disparam; sem consentimento, zero chamadas de terceiros.

## T11 — Qualidade (`feat/t11-qualidade`)
Lighthouse CI com asserções do `docs/03`, axe em todas as rotas, `check:seo` e testes de agentes no CI, `check:placeholders` (modo aviso no CI e `--strict` como script), varredura de copy (sem "!" nem emoji; termos proibidos do `CLAUDE.md`), imagens/fonte otimizadas, CSP em Report-Only, 404/erro, redirects.
**Pronto quando:** CI verde; Lighthouse mobile ≥ 90 (Performance) e 100 (SEO) em todas as rotas públicas; relatório de a11y sem violações sérias; `pnpm check:placeholders` lista exatamente o que falta (deve coincidir com `docs/08`).

## T12 — Go-live (`feat/t12-golive`) — **PARAR PARA REVISÃO** (ação do Marco)
Esta tarefa **não publica por conta própria**. Entregar: checklist final no PR com o resultado de `pnpm check:placeholders --strict` (esperado: falha enquanto faltarem WhatsApp, razão social, ≥ 3 obras) e de `pnpm check:seo`, roteiro de DNS (CNAME de `www` para a Vercel; redirecionamento do apex para `www`), roteiro de teste pós-publicação (enviar um pedido real, conferir e-mail, webhook, GA4/Pixel com consentimento, Search Console: confirmar a propriedade e enviar `sitemap.xml`; Bing Webmaster; IndexNow; Perfil da Empresa no Google; token do teste de origem do WebMCP; inspeção de URL da home e de `/jardim-vertical` no Search Console). Só depois do OK do Marco e do `--strict` verde, trocar `NEXT_PUBLIC_SITE_URL` e liberar indexação.
**Pronto quando:** o Marco aprova; domínio `www.prumopaisagismo.com.br` responde com HTTPS; apex redireciona; indexação liberada só em produção.

## Prompt inicial (colar no Claude Code, na pasta `C:\dev\prumo-site`)
> Leia `CLAUDE.md` e todos os arquivos de `docs/` na ordem indicada. Depois execute as tarefas de `docs/06-plano-de-execucao.md` de T0 a T12, uma branch e um PR por tarefa, parando apenas nas tarefas marcadas PARAR PARA REVISÃO ou quando o CLAUDE.md mandar perguntar. Não reescreva texto: copie de `docs/07`. Não invente dados. Ao fim de cada tarefa, resuma em 5 linhas (feito, placeholders usados, depende do Marco). Comece agora pela T0.
