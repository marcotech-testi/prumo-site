# 10 — Go-live (T12)

Esta tarefa **não publica por conta própria**. O site já responde em `https://www.prumopaisagismo.com.br`, com **noindex** (robots `Disallow: /` e `X-Robots-Tag: noindex`) enquanto `NEXT_PUBLIC_SITE_URL` não estiver definido em Production. Liberar a indexação é o último passo e só acontece com o OK do Marco e com o `check:placeholders --strict` verde.

## 1. Situação em 27/11/2026

### Infraestrutura (verificado)
| Item | Estado |
|---|---|
| `www.prumopaisagismo.com.br` com HTTPS | OK: 200, HSTS `max-age=63072000` |
| Apex → www | OK: `https://prumopaisagismo.com.br` → 308 → `https://www.prumopaisagismo.com.br/` |
| http → https | OK: 308 |
| DNS do site | OK: apex `A 216.198.79.1` (Vercel); `www` `CNAME …vercel-dns-017.com` |
| E-mail `contato@` | OK: MX no ImprovMX, SPF `include:spf.improvmx.com` |
| Resend | OK: domínio verificado (DKIM `resend._domainkey`, `send`/`rsend`, DMARC `p=none`); remetente `orcamento@prumopaisagismo.com.br` |
| Turnstile, Blob (OIDC), Resend na Vercel | OK: pedido de teste em produção entregue ("Delivered") em `contato@` |
| WhatsApp | OK: `NEXT_PUBLIC_WHATSAPP=5541936186969` em Production |
| Plano da Vercel | **PENDENTE**: o time está no **Hobby**, que é para uso não comercial. Migrar para Pro antes do go-live (docs/08) |

### `pnpm check:seo https://www.prumopaisagismo.com.br`
```
check:seo ok: 9 URLs, 9 links internos (noindex)
```
Depois de liberar a indexação, rode de novo com `CHECK_SEO_EXPECT=index`.

### `pnpm check:placeholders --strict` (com o WhatsApp de produção)
```
FALTA: NEXT_PUBLIC_LEGAL_NAME vazio (razão social + CNPJ; privacidade usa {{CONTROLADOR}})
FALTA: 0 obra(s) publicada(s); o go-live exige ≥ 3 com autorização de uso
FALTA: NEXT_PUBLIC_SITE_URL ≠ https://www.prumopaisagismo.com.br
FALTA: 7 trechos a revisar (parceiro/jurídico): src/content/faq.ts:20, src/content/faq.ts:33,
       src/content/pages/irrigacao.ts:22, src/content/pages/jardim-vertical.ts:32,
       src/content/pages/jardim-vertical.ts:53, src/content/pages/jardim-vertical.ts:58,
       src/content/pages/privacidade.ts:52
FALTA: 2 marcador "{{": src/content/pages/privacidade.ts:3, src/content/pages/privacidade.ts:8
info:  NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GBP_URL,
       NEXT_PUBLIC_WEBMCP_OT_TOKEN, INDEXNOW_KEY vazios (opcionais); redes sociais ocultas
exit=1 (esperado)
```
Os dois marcadores `{{CONTROLADOR}}` somem quando `NEXT_PUBLIC_LEGAL_NAME` for definido.

## 2. O que bloqueia o go-live (com o Marco)
1. **Plano comercial na Vercel** (Pro).
2. **Razão social + CNPJ** → `NEXT_PUBLIC_LEGAL_NAME` (Production) e **revisão jurídica da `/privacidade`** (inclui o trecho `privacidade.ts:52`).
3. **Parceiro revisa os trechos `REVISAR-PARCEIRO`** (lista acima). Depois de aprovados, remover o comentário em cada um.
4. **≥ 3 obras com autorização de uso** em `src/content/obras/` + `public/obras/`.
5. ~~**Search Console**: propriedade de domínio verificada por TXT~~ — feito em 28/11/2026.

## 3. Roteiro de DNS (já aplicado; manter assim)
| Host | Tipo | Valor |
|---|---|---|
| `@` (apex) | A | `216.198.79.1` (a Vercel mostra o valor em *Domains*). Redireciona para `www` na Vercel |
| `www` | CNAME | o alvo `…vercel-dns-017.com` mostrado em *Domains* |
| `@` | MX | `mx1.improvmx.com` (10), `mx2.improvmx.com` (20) |
| `@` | TXT | `v=spf1 include:spf.improvmx.com -all` |
| `resend._domainkey` | TXT | chave DKIM do Resend |
| `send` / `rsend` | CNAME | `send.forge.rmta.net` / `rsend-sae1.forge.rmta.net` |
| `_dmarc` | TXT | `v=DMARC1; p=none;` (subir para `p=quarantine` depois de algumas semanas de relatórios limpos) |
| `@` | TXT | `google-site-verification=…` (Search Console; não remover) |

Não mexer no apex/www sem necessidade: qualquer troca de A/CNAME derruba o site.

## 4. Liberar a indexação (só com o OK do Marco e o `--strict` verde)
1. Na Vercel → *Environment Variables* → Production: `NEXT_PUBLIC_SITE_URL=https://www.prumopaisagismo.com.br`.
2. Fazer o redeploy de produção (variáveis `NEXT_PUBLIC_*` entram no build).
3. Conferir:
   - `curl -sI https://www.prumopaisagismo.com.br` → sem `X-Robots-Tag: noindex`.
   - `https://www.prumopaisagismo.com.br/robots.txt` → `Allow: /` e `Sitemap:`.
   - `CHECK_SEO_EXPECT=index pnpm check:seo https://www.prumopaisagismo.com.br` → ok.
   - `NEXT_PUBLIC_SITE_URL=https://www.prumopaisagismo.com.br pnpm check:placeholders --strict` → verde.
4. Previews e `*.vercel.app` continuam `noindex` (só `VERCEL_ENV=production` com o domínio final indexa).

## 5. Roteiro de teste pós-publicação
- [ ] **Pedido real** em `/orcamento` (foto + seu próprio e-mail no campo opcional): tela "Pedido recebido"; e-mail interno em `contato@`; e-mail de confirmação na sua caixa; ver *Emails* no Resend.
- [ ] **Webhook** (se `QUOTE_WEBHOOK_URL`/`QUOTE_WEBHOOK_SECRET` estiverem definidos): o destino recebe o JSON assinado (`X-Prumo-Signature`).
- [ ] **GA4/Pixel** (depois de definir os IDs): sem consentimento, nenhuma chamada a terceiros; com "Aceitar", `page_view`, `click_whatsapp` e `submit_quote` no DebugView/Test Events. Marcar `submit_quote` como evento-chave.
- [ ] **Search Console** (propriedade já verificada): enviar `https://www.prumopaisagismo.com.br/sitemap.xml`; inspecionar a URL da home e de `/jardim-vertical` e pedir a indexação.
- [ ] **Bing Webmaster** (site já importado do Search Console em 28/11): enviar o sitemap no go-live; gerar `INDEXNOW_KEY` (hex, 8–128 caracteres) → Vercel (Production) **e** GitHub (secret `INDEXNOW_KEY`, variável `NEXT_PUBLIC_SITE_URL`). O workflow `indexnow.yml` passa a avisar a cada deploy de produção.
- [ ] **Perfil da Empresa no Google**: atendimento em área (sem endereço), nome "Prumo Paisagismo" → `NEXT_PUBLIC_GBP_URL`.
- [ ] **WebMCP**: registrar a origem em https://developer.chrome.com/origintrials → `NEXT_PUBLIC_WEBMCP_OT_TOKEN`; conferir a meta `origin-trial` no `<head>`.
- [ ] **MCP remoto**: `https://www.prumopaisagismo.com.br/mcp` responde e lista as ferramentas somente leitura.
- [ ] **Firewall da Vercel**: limite de 60 req/min por IP em `/mcp` e `/api/*`.
- [ ] **Lighthouse** mobile em produção (home, `/jardim-vertical`, `/orcamento`).
