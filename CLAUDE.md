# Prumo Paisagismo — site (instruções para o Claude Code)

Você vai **executar**, não decidir. Todas as decisões de negócio, marca, conteúdo e arquitetura já foram tomadas e estão nos documentos abaixo. Siga-os ao pé da letra. Só pare para perguntar nas situações da seção "Quando parar".

- Repositório: https://github.com/marcotech-testi/prumo-site · Produção: https://www.prumopaisagismo.com.br · Hospedagem: Vercel
- Dono: Marco Túlio. Idioma: **PT-BR** em conteúdo, interface, commits e PRs; identificadores de código em inglês.

## Ordem de leitura (obrigatória, antes de qualquer código)
1. `docs/00-decisoes.md` — o que já foi decidido e o que NÃO fazer
2. `docs/01-marca-e-design.md` — tokens, tipografia, componentes
3. `docs/02-paginas-e-conteudo.md` — rotas, estrutura e regras de conteúdo
4. `docs/07-conteudo-final.md` — **todo o texto do site, pronto** (copie, não reescreva)
5. `docs/03-arquitetura-tecnica.md` — pastas, configs, env, Vercel
6. `docs/05-orcamento-e-integracoes.md` — formulário, API, upload, e-mail, webhook
7. `docs/04-seo-ia-analytics.md` — **SEO e Google Search completos**, JSON-LD, llms.txt, consentimento
8. `docs/09-agentes-webmcp.md` — **o site já nasce legível por agentes**: conteúdo como dado, Markdown, WebMCP, MCP remoto
9. `docs/06-plano-de-execucao.md` — **as tarefas, em ordem, com critério de pronto**
10. `docs/08-pendencias-marco.md` — o que depende do Marco (use placeholders e siga)

Ativos de marca prontos estão em `assets/` (logos SVG/PNG, fonte Archivo variável + woff2, PDFs de referência). Se os documentos de WebMCP/MCP divergirem da especificação vigente (https://webmachinelearning.github.io/webmcp/), siga a especificação e registre a diferença no PR. Em conflito entre estes documentos e o PDF `assets/referencias/Manual da Marca - Prumo Paisagismo v2.pdf`, vale o PDF para marca e estes documentos para o resto.

## Premissas do projeto
- O site **nasce com SEO e Google Search totalmente configurados** (`docs/04`, `pnpm check:seo`) e **pronto para agentes de IA** (`docs/09`): todo texto em `src/content` como dado, versões Markdown, ferramentas WebMCP e MCP remoto somente leitura. Nada disso é "fase 2".

## Stack (fixa)
Next.js (App Router, última estável) · TypeScript `strict` · Tailwind CSS v4 · pnpm · Vercel · Resend · Vercel Blob · Cloudflare Turnstile · zod 4 · mcp-handler + `@modelcontextprotocol/sdk` · Vitest · Playwright (+ axe). Sem CMS, sem banco no MVP. Conteúdo em TS/MDX no repositório.

## Regras absolutas
1. **Nunca invente** preço, prazo, garantia, número de obras, clientes, depoimentos, selos, prêmios, equipe, endereço. Use exatamente o texto de `docs/07`. Onde o dado não existe, use o placeholder definido e liste no PR.
2. **Sem ® ou ™** (marca sem busca no INPI). **Não publicar o endereço residencial do Marco** em lugar nenhum.
3. **Sem preço numérico** no site por padrão (`siteConfig.priceRange = null`). O bloco de preço só renderiza se esse campo for preenchido.
4. **Sem fotos de banco e sem renders.** O site funciona sem nenhuma foto (hero tipográfico). Obras só aparecem com `autorizacaoUso: true`; sem obras, a rota `/obras` e os links para ela desaparecem.
5. **Marca**: só os arquivos de `assets/logo`, só as 6 cores do `docs/01`, só Archivo. Proibido: verde+bege+terracota, Fraunces, Inter, gradientes, sombras pesadas, cantos > 6 px, emoji, exclamação, "soluções verdes inovadoras", urgência falsa, a assinatura "Verde no prumo" (em validação).
6. **Segredos** só em variáveis de ambiente (Vercel e `.env.local` fora do git). Nunca commitar chaves, e-mails pessoais ou tokens.
7. **LGPD**: scripts de marketing (GA4, Meta Pixel) só após consentimento; "Recusar" tão visível quanto "Aceitar"; checkbox de consentimento obrigatório no formulário.
8. **Acessibilidade**: contraste ≥ 4,5:1 (use só os pares aprovados do `docs/01`), foco visível, `alt` em imagens informativas, formulário 100% por teclado, `prefers-reduced-motion`.
9. **Performance**: Server Components por padrão; `next/image` para fotos; fonte woff2 local com `font-display: swap`; meta Lighthouse mobile ≥ 90 (Performance) e 100 (SEO, Boas práticas, Acessibilidade ≥ 95).
10. **Agentes**: nenhuma ferramenta WebMCP ou MCP envia formulário, aceita consentimento, resolve antispam ou anexa arquivos; dados pessoais nunca vão em URL; a API do WebMCP é experimental e fica isolada em um módulo com detecção de recurso.
11. Trechos técnicos marcados `REVISAR-PARCEIRO` em `docs/07` devem ficar no código como comentário `// REVISAR-PARCEIRO` ao lado do texto e ser listados no PR.

## Como trabalhar
- Uma branch por tarefa (`feat/t03-layout`), PR para `main`. `main` publica em produção; cada PR gera preview. Previews e `*.vercel.app` sempre `noindex`.
- Antes de cada PR: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` passando.
- Commits em PT-BR, imperativo, curtos: `feat: página jardim vertical`.
- Execute as tarefas de `docs/06` na ordem. Ao fim de cada uma: PR, resumo de 5 linhas (feito / placeholders usados / depende do Marco), e siga para a próxima sem esperar, **exceto** nas tarefas marcadas `PARAR PARA REVISÃO`.
- Se o Next.js instalado for mais novo que os exemplos dos docs, siga a documentação oficial da versão instalada mantendo o comportamento descrito.

## Quando parar e perguntar (somente isto)
- Credencial, chave de API, acesso a conta ou DNS que você não tem.
- Um critério de pronto impossível de cumprir sem dado que falta (ex.: ≥ 3 obras para o go-live).
- Conflito real entre dois documentos que o PDF do manual não resolve.
- Qualquer ação irreversível fora do repositório (apontar domínio, publicar em produção com domínio real, enviar e-mail real a terceiros).
