# 03 — Arquitetura técnica

## Criação do projeto (tarefa T1)
Trabalhar em `C:\dev\prumo-site` (clone de `marcotech-testi/prumo-site`). Se o repositório estiver vazio, criar o app **na raiz do clone**, preservando `CLAUDE.md`, `docs/` e `assets/`:
```
pnpm dlx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```
Se pedir confirmação por arquivos existentes, aceitar (não sobrescreve `CLAUDE.md`/`docs`). Depois: `pnpm add zod resend @vercel/blob @vercel/analytics @vercel/speed-insights` e `pnpm add -D vitest @vitejs/plugin-react @playwright/test @axe-core/playwright prettier prettier-plugin-tailwindcss tsx`.
Node ≥ 20 LTS. `"packageManager"` fixado no `package.json`. `.gitignore` com `.env*.local`, `.next`, `node_modules`, `.vercel`, `playwright-report`, `test-results`.

## Estrutura
```
src/
  app/
    (site)/ layout.tsx, page.tsx, jardim-vertical/, irrigacao-automatizada-e-paisagismo/,
            manutencao-de-jardim-vertical/, para-arquitetos/, obras/, orcamento/,
            perguntas-frequentes/, sobre/, privacidade/
    api/orcamento/route.ts            # POST: valida, e-mail, webhook
    api/orcamento/upload/route.ts     # handleUpload do Vercel Blob (token temporário)
    icon.svg, apple-icon.png, opengraph-image.png, robots.ts, sitemap.ts, not-found.tsx, error.tsx, globals.css
    llms.txt/route.ts                 # texto estático (ver docs/04)
    md/[[...slug]]/route.ts           # versão Markdown de cada página (docs/09)
    api/[transport]/route.ts          # servidor MCP remoto somente leitura (/mcp via rewrite) (docs/09)
    manifest.ts, favicon.ico          # ícones e manifesto (docs/04)
  components/ ui/ (Button, Accordion, SpecSheet, Container…), layout/ (Header, Footer, StickyCTA),
             sections/ (Hero, Services, Why, Steps, FaqList, CtaFinal…), forms/ (QuoteForm), consent/ (CookieBanner, Analytics)
  content/ site.ts, pages/*.ts, faq.ts, steps.ts, servicos.ts, obras/*.mdx, obras.ts (leitura + validação zod)  # TODO texto do site mora aqui
  components/agents/ WebMcp.tsx
  lib/agent-tools/ definitions.ts (zod 4, fonte única das ferramentas)  lib/webmcp/ register.ts, tools.ts  lib/markdown.ts
  lib/ env.ts, seo.ts, schema.ts (JSON-LD), mail.ts, webhook.ts, antispam.ts, utm.ts, whatsapp.ts, consent.ts
public/ brand/ (SVGs usados), fonts/ (woff2 + OFL.txt), assinatura/ (png de e-mail), obras/ (fotos)
scripts/ check-placeholders.ts, check-contrast.ts, build-assets.ts (gera favicon/OG)
tests/ unit/ (zod, whatsapp, utm, hmac) e e2e/ (orçamento, nav, a11y)
```
Copiar de `assets/` para `public/`: logos usados no site (horizontal positivo/branco, símbolo branco/positivo) em `public/brand/`; `archivo-vf-latin.woff2` e `OFL.txt` em `public/fonts/`; `assinatura-logo-480px.png` em `public/assinatura/`. Pré-carregar a fonte no `<head>` do layout (`<link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous">`).

## Variáveis de ambiente (`.env.example` completo; `src/lib/env.ts` valida com zod)
| Variável | Escopo | Obrigatória em produção | Observação |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | público | sim | `https://www.prumopaisagismo.com.br` |
| `NEXT_PUBLIC_EMAIL` | público | não | padrão contato@prumopaisagismo.com.br |
| `NEXT_PUBLIC_WHATSAPP` | público | não (placeholder) | só dígitos com DDI |
| `NEXT_PUBLIC_PHONE` | público | não | |
| `NEXT_PUBLIC_SOCIAL_LIVE` | público | não | `true` mostra redes |
| `NEXT_PUBLIC_LEGAL_NAME` | público | sim no go-live | razão social + CNPJ |
| `NEXT_PUBLIC_GA_ID` | público | não | GA4 `G-…` |
| `NEXT_PUBLIC_META_PIXEL_ID` | público | não | |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | público | sim | |
| `TURNSTILE_SECRET_KEY` | servidor | sim | |
| `RESEND_API_KEY` | servidor | sim | |
| `QUOTE_TO_EMAIL` | servidor | sim | destino dos pedidos (separar por vírgula) |
| `QUOTE_FROM_EMAIL` | servidor | sim | ex. `Prumo Paisagismo <orcamento@prumopaisagismo.com.br>`; até o domínio ser verificado no Resend, usar `onboarding@resend.dev` |
| `BLOB_READ_WRITE_TOKEN` | servidor | sim | criado ao conectar o Blob na Vercel |
| `NEXT_PUBLIC_WEBMCP_OT_TOKEN` | público | não | token do teste de origem do WebMCP (docs/09) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | público | não | meta de verificação do Google Search Console (reserva do DNS) |
| `NEXT_PUBLIC_BING_VERIFICATION` | público | não | meta `msvalidate.01` do Bing Webmaster |
| `NEXT_PUBLIC_GBP_URL` | público | não | URL do Perfil da Empresa no Google (`sameAs`) |
| `INDEXNOW_KEY` | servidor/CI | não | chave IndexNow (gera `public/{chave}.txt`) |
| `QUOTE_WEBHOOK_URL` | servidor | não | |
| `QUOTE_WEBHOOK_SECRET` | servidor | se houver webhook | |
Em desenvolvimento, `env.ts` aceita chaves de teste do Turnstile (`1x00000000000000000000AA`, sempre passa) e `RESEND_API_KEY` vazia faz a API logar o e-mail no console em vez de enviar.

## Vercel
- Projeto ligado ao repositório; branch de produção `main`; Framework Preset Next.js; região das functions `gru1`. Comando de build `pnpm build`.
- Cabeçalho `X-Robots-Tag: noindex, nofollow` em todos os deploys que não sejam o domínio de produção (verificar `VERCEL_ENV !== "production"` **ou** host ≠ `www.prumopaisagismo.com.br`); no domínio `*.vercel.app` de produção também `noindex` até o go-live (`NEXT_PUBLIC_SITE_URL` ainda não apontado).
- Domínio: `www.prumopaisagismo.com.br` principal; `prumopaisagismo.com.br` redireciona 308 para `www`. (DNS é do Marco, ver `docs/08`.)
- Headers em `next.config.ts`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, HSTS (a Vercel já aplica no domínio), e `Content-Security-Policy-Report-Only` com: `default-src 'self'`; `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://connect.facebook.net https://va.vercel-scripts.com`; `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.facebook.com https://*.public.blob.vercel-storage.com https://vitals.vercel-insights.com`; `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://www.facebook.com`; `frame-src https://challenges.cloudflare.com`; `style-src 'self' 'unsafe-inline'`; `font-src 'self'`. Manter em Report-Only no MVP (documentar no README como promover a enforcing).
- Cache: ativos estáticos com cache longo (padrão Next); páginas estáticas (SSG) sempre que possível; `/api/*` sem cache.

## Rewrites e headers adicionais
`next.config.ts`: `rewrites` para `.md`, `Accept: text/markdown` e `/mcp` (docs/09); `Link` e `Vary: Accept` nas páginas HTML. Se a versão do Next instalada renomeou conceitos (ex.: middleware/proxy), seguir a documentação vigente.

## Qualidade e CI (GitHub Actions `ci.yml`)
Em PR e push para `main`: `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `test` (Vitest) → `build` → `check:contrast` → `check:placeholders` (modo aviso) → `check:seo` (docs/04) → Playwright (e2e + axe + testes de agentes do docs/09) contra `next start` → Lighthouse CI (`@lhci/cli`) com asserções: performance ≥ 0.9, accessibility ≥ 0.95, best-practices ≥ 0.95, seo = 1 (mobile). Falha em qualquer item bloqueia o merge.
`check:placeholders --strict` (usado só na tarefa de go-live, T12) falha se: `NEXT_PUBLIC_WHATSAPP` vazio ou igual ao exemplo `5541900000000`; existe `{{` ou `⟦` ou `REVISAR-` em `src/content`/`src/app`; `NEXT_PUBLIC_LEGAL_NAME` vazio; menos de 3 obras publicadas; `NEXT_PUBLIC_SITE_URL` não é o domínio de produção.
`check:contrast`: calcula WCAG para os 6 pares aprovados do `docs/01` e falha se algum < 4,5:1.
