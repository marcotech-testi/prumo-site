# 08 — Pendências do Marco (o Claude Code usa placeholders e segue; nada aqui bloqueia o desenvolvimento)

Marque cada item quando concluir. "Bloqueia go-live" = o site só vai ao ar com o item resolvido.

## Contas e chaves (criar e entregar como variáveis de ambiente na Vercel — nunca colar no chat nem no git)
- [ ] **Vercel**: conta/time com plano que permita **uso comercial** (o plano gratuito é para uso não comercial; confirmar), projeto ligado ao repositório. *Bloqueia go-live.*
- [x] **Resend**: criar conta, verificar o domínio `prumopaisagismo.com.br` (adicionar os registros DNS que o Resend mostrar: SPF/DKIM), gerar `RESEND_API_KEY`. *Bloqueia go-live.* — feito em 27/11/2026 (remetente `orcamento@`).
- [x] **Cloudflare Turnstile**: criar widget para `www.prumopaisagismo.com.br` e para localhost/previews → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`. *Bloqueia go-live.*
- [x] **Vercel Blob**: criar o store no projeto (stores novos usam OIDC: `BLOB_STORE_ID`, sem `BLOB_READ_WRITE_TOKEN`). *Bloqueia go-live.*
- [ ] **GA4** (`NEXT_PUBLIC_GA_ID`) e **Meta Pixel** (`NEXT_PUBLIC_META_PIXEL_ID`), antes de ligar o tráfego pago.
- [x] **Google Search Console**: criar a propriedade de **domínio** `prumopaisagismo.com.br` e verificar por registro TXT no DNS (reserva: meta em `NEXT_PUBLIC_GSC_VERIFICATION`). No go-live: enviar `https://www.prumopaisagismo.com.br/sitemap.xml`, inspecionar e pedir indexação da home e de `/jardim-vertical`. *Bloqueia go-live.* — propriedade de domínio verificada por TXT em 28/11/2026; sitemap e inspeção ficam para o go-live.
- [ ] **Bing Webmaster Tools**: ~~importar do Search Console~~ (feito em 28/11/2026: site importado do GSC, sem verificação extra); falta: gerar uma chave **IndexNow** (qualquer string hexadecimal de 8–128 caracteres) → `INDEXNOW_KEY` na Vercel e no GitHub Actions. Chave criada em 28/11/2026 (secret no GitHub e variável em Production na Vercel); a variável de repositório `NEXT_PUBLIC_SITE_URL` só entra no go-live.
- [ ] **Perfil da Empresa no Google** (atendimento em área, sem endereço visível; nome só "Prumo Paisagismo", sem empilhar palavras-chave; categoria de paisagismo; área de atendimento Curitiba e RMC) → URL em `NEXT_PUBLIC_GBP_URL`. Pedir avaliação a cada obra entregue.
- [ ] **GA4**: marcar `submit_quote` como evento-chave (conversão) e vincular GA4 ↔ Search Console (e ↔ Google Ads, se for anunciar).
- [ ] **WebMCP (teste de origem do Chrome)**: registrar `https://www.prumopaisagismo.com.br` em https://developer.chrome.com/origintrials (WebMCP) e entregar o token em `NEXT_PUBLIC_WEBMCP_OT_TOKEN`. Sem token as ferramentas só funcionam em Chrome com a flag.
- [ ] **Firewall da Vercel**: regra de limite de taxa para `/mcp` e `/api/*` (ex.: 60 requisições/min por IP).

## Domínio e e-mail
- [x] **E-mail contato@**: configurar o MX no Registro.br (hoje o MX está nulo e o e-mail recusa mensagens). Até lá, definir `QUOTE_TO_EMAIL` com um e-mail que funcione. *Bloqueia go-live (os clientes vão escrever para esse endereço).*
- [x] **DNS do site** (só no go-live): `www` → CNAME para a Vercel; apex redireciona para `www` (roteiro em `docs/10-go-live.md`; já aplicado em 27/11/2026).
- [ ] Publicar a imagem de assinatura de e-mail (já servida pelo site em `/assinatura/assinatura-logo-480px.png`).

## Conteúdo e dados
- [x] **WhatsApp comercial** definido e ativo: **(41) 93618-6969** (confirmado em 27/11/2026). O cartão, a apresentação, o modelo de orçamento e o manual da marca já trazem o número. O WhatsApp é atendido pela assistente de IA "Vera" (base de conhecimento em `docs/assistente-ia/`), que passa para a equipe quando necessário.
- [x] **WhatsApp no site**: definir `NEXT_PUBLIC_WHATSAPP=5541936186969` na Vercel (produção e preview). Sem a variável, os botões de WhatsApp continuam ocultos. *Bloqueia go-live.* — feito em Production em 27/11/2026 (preview ainda sem).
- [ ] **≥ 3 obras reais do parceiro** com autorização de uso (cliente e parceiro): fotos (jardim inteiro, detalhe, escala, **irrigação**), bairro, metragem, espécies, tipo de irrigação, ano, prazo. Entregar em `src/content/obras/` + `public/obras/`. *Bloqueia go-live.*
- [ ] **Razão social e CNPJ** que operam o site (`NEXT_PUBLIC_LEGAL_NAME`) e **revisão jurídica da `/privacidade`** (minuta). *Bloqueia go-live.*
- [ ] **Parceiro de execução revisa** os trechos `REVISAR-PARCEIRO` (estrutura/drenagem, clima, umidade/impermeabilização, irrigação sem ponto de água) — lista no PR da T4. *Bloqueia go-live.*
- [ ] **Decidir se publica faixa de preço** (`siteConfig.priceRange`): hoje não publica; o ticket do modelo (R$ 1.800/m²) só se valida com os primeiros orçamentos.
- [ ] **Prazo e garantia** reais (jurídico + parceiro): hoje o site diz que constam por escrito na proposta.
- [ ] Validar a assinatura "Verde no prumo" (hoje não é usada no site).

## Marca e redes
- [ ] **Busca de marca no INPI** (classes de paisagismo e instalação) com o jurídico. Até lá, sem ® ou ™.
- [ ] Criar **@prumopaisagismo** no Instagram, TikTok e YouTube; depois definir `NEXT_PUBLIC_SOCIAL_LIVE=true`. Bio: "Jardins verticais e paisagismo com irrigação automatizada | Curitiba. Orçamento pelo link." Link da bio: `https://www.prumopaisagismo.com.br/orcamento?utm_source=instagram&utm_medium=bio`.
- [ ] 9 a 12 posts de obras reais no Instagram antes de ligar o tráfego pago.

## Ambiente de desenvolvimento
- [ ] Rodar `preparar-repo.ps1` (cria `C:\dev\prumo-site` e copia instruções e ativos). Autenticar o Git no GitHub na máquina.
- [ ] Autorizar o Claude Code a rodar `pnpm`, `git`, `gh` e `vercel` no clone.
