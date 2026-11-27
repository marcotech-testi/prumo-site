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

## Orçamento online (fluxo)
1. A pessoa preenche `/orcamento` (validação zod no navegador, `src/lib/quote-schema.ts`).
2. Ao enviar, o navegador chama `POST /api/orcamento/passe` com o token do Turnstile. O servidor verifica o token **uma vez** e devolve um passe assinado (HMAC, 30 min).
3. Com o passe, cada arquivo vai **direto do navegador para o Vercel Blob** (`POST /api/orcamento/upload` emite um token temporário só para `orcamentos/{ano-mes}/{uuid}-{nome}`, tipos e tamanho restritos, sufixo aleatório).
4. `POST /api/orcamento` recebe só as URLs. O servidor valida de novo com o mesmo schema, aplica o antispam (honeypot, tempo mínimo de 4 s, passe; bots recebem 200 silencioso), aceita apenas URLs do store de Blob do projeto, confere tipo e tamanho reais (`head`), envia o e-mail interno (Resend) e a confirmação ao cliente e dispara o webhook.
5. Falha no e-mail interno → 502 e os dados continuam no formulário. Falha no webhook só é registrada.

**Modo local:** sem `BLOB_READ_WRITE_TOKEN` e fora da Vercel, os arquivos vão para a pasta temporária do sistema (`/api/orcamento/upload-local`). Sem `RESEND_API_KEY`, os e-mails aparecem no console. Sem chave do Turnstile, a verificação é dispensada (só fora da Vercel).

## Integração com o sistema de orçamento
O sistema de orçamento e a IA de atendimento são outro projeto; este repositório só entrega o webhook.

- Configure `QUOTE_WEBHOOK_URL` e `QUOTE_WEBHOOK_SECRET` (obrigatório quando há URL).
- `POST` com `Content-Type: application/json`, timeout de 5 s e 2 tentativas.
- Cabeçalhos:
  - `X-Prumo-Signature: sha256=<hex>`: HMAC-SHA256 do **corpo bruto** com `QUOTE_WEBHOOK_SECRET`.
  - `X-Prumo-Timestamp: <epoch em segundos>`.
- Para validar: recalcule o HMAC sobre os bytes recebidos (antes de qualquer parse), compare em tempo constante e rejeite timestamps com mais de 5 minutos de diferença.

Corpo (`schemaVersion: 1`):
```json
{
  "schemaVersion": 1,
  "id": "pq_0f8a…",
  "receivedAt": "2026-11-27T16:40:00-03:00",
  "perfil": "cliente",
  "contato": { "nome": "", "whatsapp": "5541900000000", "email": null },
  "local": { "cidade": "Curitiba", "bairro": "Batel" },
  "espaco": { "tipo": "fachada_externa", "larguraM": 6, "alturaM": 3, "areaAproxM2": 18, "naoSeiMedidas": false },
  "condicoes": { "sol": "meia_sombra", "pontoAgua": "sim" },
  "prazo": "1_3_meses",
  "mensagem": null,
  "arquivos": [{ "url": "https://….public.blob.vercel-storage.com/…", "nome": "parede-1.jpg", "tipo": "image/jpeg", "tamanhoBytes": 2400000 }],
  "origem": { "pagina": "/jardim-vertical", "referrer": null, "utm_source": null, "utm_medium": null, "utm_campaign": null, "utm_content": null, "utm_term": null, "gclid": null, "fbclid": null, "obra": null },
  "consentimento": { "aceito": true, "politicaVersao": "2026-11-27", "em": "2026-11-27T16:40:00-03:00" }
}
```
Valores possíveis: `perfil` = `cliente | arquiteto | construtora`; `espaco.tipo` = `fachada_externa | parede_interna | varanda | area_gourmet | empreendimento | outro`; `condicoes.sol` = `sol_pleno | meia_sombra | sombra | nao_sei`; `condicoes.pontoAgua` = `sim | nao | nao_sei`; `prazo` = `o_quanto_antes | 1_3_meses | planejando | sem_pressa | null`. Medidas ficam `null` quando `naoSeiMedidas` é `true`.

Exemplo de verificação (Node):
```js
import { createHmac, timingSafeEqual } from "node:crypto";
const expected = "sha256=" + createHmac("sha256", process.env.QUOTE_WEBHOOK_SECRET).update(rawBody).digest("hex");
const ok = timingSafeEqual(Buffer.from(expected), Buffer.from(req.headers["x-prumo-signature"]));
```
