# 05 — Orçamento online, API e integrações

O formulário é a conversão principal. Implementar exatamente assim.

## Campos do formulário (`src/components/forms/QuoteForm.tsx`; **página única, um só `<form>`**, dois `<fieldset>` com legenda: "A parede" e "Contato"; nenhum campo escondido, para que pessoas e agentes vejam todos os campos no DOM)
**Fieldset 1 — A parede**
| Campo (`name`) | Rótulo | Tipo / opções | Obrigatório |
|---|---|---|---|
| `perfil` | Você é | rádio: `cliente` "Proprietário(a)" · `arquiteto` "Arquiteto(a) ou designer" · `construtora` "Construtora ou incorporadora" (pré-seleciona por `?perfil=`) | sim |
| `tipo` | Onde será o jardim | select: `fachada_externa` Fachada ou muro externo · `parede_interna` Parede interna · `varanda` Varanda · `area_gourmet` Área gourmet · `empreendimento` Área comum de empreendimento · `outro` Outro | sim |
| `larguraM` / `alturaM` | Largura (m) / Altura (m) | número, vírgula aceita, 0,5–60 | um dos dois caminhos: medidas **ou** `naoSeiMedidas` |
| `naoSeiMedidas` | Não sei as medidas | checkbox | |
| `sol` | Luz na parede | select: `sol_pleno` Sol direto boa parte do dia · `meia_sombra` Meia-sombra · `sombra` Pouca luz · `nao_sei` Não sei | sim |
| `pontoAgua` | Ponto de água por perto | rádio: `sim` · `nao` · `nao_sei` | sim |
| `fotos` | Fotos ou vídeo da parede | upload múltiplo (ver limites) com pré-visualização e remover | sim, mín. 1 (recomendar 3: parede inteira, de perto, entorno) |
| `prazo` | Quando pretende fazer | select: `o_quanto_antes` · `1_3_meses` · `planejando` · `sem_pressa` | não |
| `mensagem` | Quer contar mais? | textarea até 1000 caracteres | não |

**Fieldset 2 — Contato**
| `nome` | Nome (`autocomplete="name"`) | texto 2–80 | sim |
| `whatsapp` | WhatsApp (`autocomplete="tel"`, `inputMode="tel"`) | máscara `(41) 90000-0000`, validar DDD+9 dígitos | sim |
| `email` | E-mail (opcional; `autocomplete="email"`) | e-mail válido | não |
| `cidade` | Cidade (`autocomplete="address-level2"`) | texto com `datalist` (cidades de `areaServed` + "Outra") | sim |
| `bairro` | Bairro | texto 2–60 | sim |
| `consentimento` | "Concordo com o uso destes dados para receber o orçamento, conforme a [Política de Privacidade]." | checkbox | sim |
Campos ocultos: `origem` (UTMs, gclid, fbclid, referrer, landingPage, `obra` se veio de uma obra), `website` (honeypot, deve ficar vazio), `renderedAt` (timestamp), `turnstileToken`.

**Limites de arquivos:** até 6 arquivos; imagens `image/jpeg|png|webp|heic|heif` até 10 MB cada; no máximo 1 vídeo `video/mp4|quicktime` até 100 MB; total 150 MB. Validar tipo e tamanho no navegador e no servidor.

**Comportamento:** validação com zod (mesmo schema no cliente e no servidor, em `src/lib/quote-schema.ts`); mensagens de erro em PT-BR junto ao campo, `aria-describedby`, foco no primeiro erro; rascunho salvo em `sessionStorage` (sem os arquivos); **ao montar, lê `prumo:quote-draft`** (gravado pela ferramenta WebMCP `iniciar_pedido_orcamento`, ver `docs/09`), preenche os campos válidos, apaga o rascunho, e também ouve o evento `prumo:quote-draft`; lê `?perfil=`, `?tipo=`, `?obra=` da URL (nunca dados pessoais); botão desabilitado enquanto envia; evento `start_quote` no primeiro foco; `submit_quote` no sucesso. Textos em `docs/07`.

## Upload das fotos (Vercel Blob, direto do navegador)
- `POST /api/orcamento/upload` usa `handleUpload` de `@vercel/blob/client`; em `onBeforeGenerateToken`: exigir `clientPayload` com `turnstileToken` válido (verificar na API do Turnstile), restringir `allowedContentTypes` e `maximumSizeInBytes`, `addRandomSuffix: true`, caminho `orcamentos/{ano-mes}/{uuid}-{nomeSanitizado}`. Sem listagem pública de pastas; as URLs são imprevisíveis.
- O navegador faz `upload()` de cada arquivo e envia só as URLs na submissão. O servidor aceita **apenas URLs do host do Blob do projeto**.

## `POST /api/orcamento` (route handler, `runtime = "nodejs"`)
1. Parse + zod (`schemaVersion: 1`). Falhou → 400 `{ok:false, errors}`.
2. Antispam, nesta ordem, todos devolvem 200 silencioso para bots (sem dar pista): honeypot preenchido; `Date.now() - renderedAt < 4000`; Turnstile inválido (verificar token de 1 uso).
3. Montar o registro (formato abaixo), gerar `id` (`pq_` + ULID/uuid), `receivedAt` ISO com fuso `America/Sao_Paulo`.
4. **E-mail interno** (Resend) para `QUOTE_TO_EMAIL`:
   - Assunto: `Novo pedido de orçamento — {tipoLegivel} — {bairro}, {cidade}` · `reply_to` = e-mail do cliente se houver.
   - Corpo (texto + HTML simples): perfil, nome, link `https://wa.me/55{whatsapp}` clicável, e-mail, cidade/bairro, tipo, medidas (ou "não sabe"), área aproximada calculada, luz, ponto de água, prazo, mensagem, **lista de links das fotos**, origem (utm_source/medium/campaign, gclid/fbclid presença, página de entrada), id do pedido, data/hora.
5. **E-mail de confirmação** ao cliente, se informou e-mail. Assunto: `Recebemos seu pedido — Prumo Paisagismo`. Corpo: "Olá, {nome}. Recebemos as fotos e as medidas da sua parede. Retornamos com uma faixa de investimento em até um dia útil, em horário comercial. — Prumo Paisagismo · www.prumopaisagismo.com.br · contato@prumopaisagismo.com.br". Sem imagens externas, sem rastreadores.
6. **Webhook** (se `QUOTE_WEBHOOK_URL`): `POST` JSON abaixo, header `X-Prumo-Signature: sha256=<HMAC-SHA256 do corpo bruto com QUOTE_WEBHOOK_SECRET>` e `X-Prumo-Timestamp` (epoch s); timeout 5 s, 2 tentativas; **falha do webhook não derruba o envio** (loga o erro).
7. Resposta `200 {ok:true, id}`. Falha no e-mail interno → 502 `{ok:false}` (o cliente vê a mensagem de erro e os dados continuam no formulário). Nada é gravado em banco; o e-mail e o webhook são o registro.

### Contrato do webhook (`schemaVersion: 1`)
```json
{
  "schemaVersion": 1,
  "id": "pq_01J...",
  "receivedAt": "2026-11-27T16:40:00-03:00",
  "perfil": "cliente",
  "contato": { "nome": "", "whatsapp": "5541900000000", "email": null },
  "local": { "cidade": "Curitiba", "bairro": "Batel" },
  "espaco": { "tipo": "fachada_externa", "larguraM": 6, "alturaM": 3, "areaAproxM2": 18, "naoSeiMedidas": false },
  "condicoes": { "sol": "meia_sombra", "pontoAgua": "sim" },
  "prazo": "1_3_meses",
  "mensagem": null,
  "arquivos": [{ "url": "https://...public.blob.vercel-storage.com/...", "nome": "parede-1.jpg", "tipo": "image/jpeg", "tamanhoBytes": 2400000 }],
  "origem": { "pagina": "/jardim-vertical", "referrer": null, "utm_source": null, "utm_medium": null, "utm_campaign": null, "utm_content": null, "utm_term": null, "gclid": null, "fbclid": null, "obra": null },
  "consentimento": { "aceito": true, "politicaVersao": "2026-11-27", "em": "2026-11-27T16:40:00-03:00" }
}
```
Documentar este contrato no `README.md` do repositório (seção "Integração com o sistema de orçamento"). O sistema de orçamento e a IA de atendimento do Marco são **outro projeto**: este repositório só entrega o webhook.

## WhatsApp
Botão no header (desktop), na barra fixa (mobile) e no CTA final. Link e mensagens por página conforme `docs/07`. Registrar `click_whatsapp`. Sem número configurado, sumir e manter só o formulário.

## Fora do escopo do MVP
Login de cliente, pagamento, CMS, blog, chatbot, banco de dados, painel. (O chatbot de atendimento é fase 2, consumindo o webhook.)
