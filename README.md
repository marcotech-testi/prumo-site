# Prumo Paisagismo — site

Site institucional e de orçamento online da Prumo Paisagismo (jardins verticais com irrigação automatizada, Curitiba e região metropolitana).

- Produção: https://www.prumopaisagismo.com.br (Vercel)
- Instruções de projeto: [`CLAUDE.md`](CLAUDE.md) e [`docs/`](docs)

## Stack
Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · pnpm · Vercel · Resend · Vercel Blob · Cloudflare Turnstile · zod 4 · mcp-handler · Vitest · Playwright + axe.

## Como rodar
Requisitos: Node ≥ 20 e pnpm (versão fixada em `packageManager`). Trabalhe fora do OneDrive (ex.: `C:\dev\prumo-site`).

```bash
pnpm install
cp .env.example .env.local   # preencha o que tiver; vazio funciona em dev
pnpm dev                     # http://localhost:3000
```

| Script | O que faz |
|---|---|
| `pnpm lint` / `pnpm typecheck` | ESLint e TypeScript |
| `pnpm test` | testes unitários (Vitest) |
| `pnpm build` / `pnpm start` | build e servidor de produção |
| `pnpm test:e2e` | Playwright (sobe `next start` na porta 3100; rode `pnpm build` antes) |
| `pnpm format` | Prettier |

Antes de cada PR: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Variáveis de ambiente
Todas listadas em [`.env.example`](.env.example) e validadas em `src/lib/env.ts`. Segredos só na Vercel e em `.env.local` (fora do git). Em desenvolvimento, as chaves de teste do Turnstile sempre passam e `RESEND_API_KEY` vazia faz a API logar os e-mails no console. Detalhes por variável em `docs/03-arquitetura-tecnica.md`.

## Deploy (Vercel)
1. Importar `marcotech-testi/prumo-site` na Vercel (Framework Preset: Next.js, build `pnpm build`), ou `vercel link` na pasta do clone.
2. Branch de produção: `main`. Cada PR gera um preview (sempre `noindex`).
3. Região das functions: `gru1` (Settings → Functions).
4. Cadastrar as variáveis de ambiente (Production e Preview).
5. Conferir que a conta/time tem plano que permite uso comercial (o Hobby não permite).

Todo deploy que não for produção com `NEXT_PUBLIC_SITE_URL=https://www.prumopaisagismo.com.br` responde `X-Robots-Tag: noindex, nofollow`.

## DNS (go-live, feito pelo Marco)
- `www.prumopaisagismo.com.br` → CNAME para o valor indicado pela Vercel (Settings → Domains).
- `prumopaisagismo.com.br` (apex) → registro A indicado pela Vercel, com redirecionamento 308 para `www`.
- Depois: `NEXT_PUBLIC_SITE_URL=https://www.prumopaisagismo.com.br` em Production e novo deploy.

## CSP
Os cabeçalhos estão em `next.config.ts`. A CSP está em `Content-Security-Policy-Report-Only` no MVP. Para tornar obrigatória: acompanhar o console por alguns dias sem violações e trocar a chave para `Content-Security-Policy`.

## Integração com o sistema de orçamento
O contrato completo do webhook (`schemaVersion: 1`) é documentado na tarefa T7 (ver `docs/05-orcamento-e-integracoes.md`).
