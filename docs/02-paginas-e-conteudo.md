# 02 — Páginas, rotas e regras de conteúdo

Todo o texto está em `docs/07-conteudo-final.md`. Aqui ficam rotas, seções, comportamento e os dados de configuração.

## Rotas (App Router; sem barra final; tudo em `src/app/(site)/`)
| Rota | Arquivo | Seções (na ordem) |
|---|---|---|
| `/` | `page.tsx` | Hero · Resposta ("Um jardim vertical só é bonito…") · Serviços (3 cards) · Por que a Prumo (4) · Obras *(condicional)* · Como funciona (6 etapas) · Para arquitetos (faixa) · FAQ (4 perguntas) · CTA final |
| `/jardim-vertical` | `jardim-vertical/page.tsx` | Hero interno · Resposta direta · Onde instalar · Como funciona o sistema · Espécies e luz · Clima e parede · Investimento · Prazo · Etapas · FAQ da página · CTA |
| `/irrigacao-automatizada-e-paisagismo` | idem | Hero interno · Resposta direta · Como funciona a irrigação · Por que faz diferença · Paisagismo sob consulta · FAQ · CTA |
| `/manutencao-de-jardim-vertical` | idem | Hero interno · Resposta direta · O que inclui (SpecSheet) · Como contratar · FAQ · CTA |
| `/para-arquitetos` | idem | Hero interno · Proposta · 3 blocos (Especificação, Execução, Pós-obra) · Como trabalhamos · CTA (`/orcamento?perfil=arquiteto`) |
| `/obras` e `/obras/[slug]` | idem | **Só existem se houver ≥ 1 obra publicada**; senão `notFound()` e fora do menu/sitemap |
| `/orcamento` | idem | Introdução · QuoteForm · lateral com "O que acontece depois" |
| `/perguntas-frequentes` | idem | Todas as perguntas (accordion) + JSON-LD FAQPage |
| `/sobre` | idem | Texto · 3 pilares · significado do nome |
| `/privacidade` | idem | Política de Privacidade e Cookies (minuta; ver aviso em `docs/07`) |
| `/assinatura/assinatura-logo-480px.png` | `public/assinatura/` | Imagem usada na assinatura de e-mail |
| `not-found.tsx`, `error.tsx` | | Mensagem curta, link para início e orçamento |

Cada página de serviço: um único H1, a **resposta direta (2–3 frases) logo abaixo do H1**, headings H2 em forma de pergunta ou rótulo claro, links internos (serviço ↔ manutenção ↔ irrigação ↔ FAQ ↔ orçamento), CTA ao fim.

## Configuração central — `src/content/site.ts`
```ts
export const siteConfig = {
  name: "Prumo Paisagismo",
  descriptor: "Jardins verticais e paisagismo com irrigação automatizada | Curitiba",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.prumopaisagismo.com.br",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "contato@prumopaisagismo.com.br",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",       // só dígitos com DDI, ex. 5541999999999; vazio = esconde botões
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",             // vazio = oculto
  instagram: "prumopaisagismo",
  socialLive: process.env.NEXT_PUBLIC_SOCIAL_LIVE === "true",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "",    // vazio = rodapé só com "Prumo Paisagismo"
  priceRange: null as null | { minM2: number; maxM2: number; note: string }, // null = não publicar preço
  areaServed: ["Curitiba", "São José dos Pinhais", "Pinhais", "Colombo", "Araucária", "Campo Largo", "Fazenda Rio Grande"],
  consentVersion: "2026-11-27",
};
```
`WhatsApp link`: `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`; a mensagem pré-pronta de cada página está em `docs/07` e leva `utm`/origem. Se `whatsapp` vazio, **todos** os botões de WhatsApp somem e o CTA vira só "Pedir orçamento".

## Obras — modelo de conteúdo (`src/content/obras/*.mdx`)
Frontmatter (validado com zod; build falha se inválido):
```yaml
titulo: "Jardim vertical em fachada"      # sem nome de cliente
slug: "fachada-batel-18m2"
bairro: "Batel"
cidade: "Curitiba"
tipo: "fachada_externa"   # fachada_externa | parede_interna | varanda | area_gourmet | muro | empreendimento
metragemM2: 18
especies: ["..."]
irrigacao: "Gotejamento com controlador programável"
prazoDias: 21            # opcional
ano: 2026
autorizacaoUso: true     # false/ausente = NÃO publica
fotos:
  - { src: "/obras/fachada-batel/01.jpg", alt: "...", tipo: "geral" }   # geral|detalhe|escala|irrigacao|antes|depois
```
Regras: obra só é listada com `autorizacaoUso: true`, ≥ 2 fotos e **pelo menos uma foto `tipo: irrigacao`**. A ficha técnica (SpecSheet) mostra: Local (bairro, cidade), Metragem, Tipo, Espécies, Irrigação, Prazo, Ano. Sem nome de cliente, sem endereço de rua, sem número do imóvel. Em desenvolvimento, `src/content/obras/_exemplo.mdx` (com `autorizacaoUso: false`) valida o layout.

## Regras de copy
0. **Todo texto fica em `src/content/` como dado tipado** (ver `docs/09`, camada 0); componentes só renderizam. Isso permite gerar HTML, Markdown, JSON-LD, `llms.txt` e ferramentas de agentes a partir da mesma fonte. Texto hardcoded em JSX é proibido.
1. Copiar de `docs/07`, sem reescrever. Se faltar texto para algo, **escrever no mesmo tom** (curto, exato, sem adjetivo) e registrar no PR como "texto novo para revisão".
2. Português do Brasil, acentuação correta, "você". Medidas: "18 m²", "R$ 1.800" (nunca no site hoje, ver decisões).
3. Termos para usar de forma natural: jardim vertical, parede verde, muro verde, jardim de parede, irrigação automatizada, manutenção de jardim vertical, Curitiba e região metropolitana. Não empilhar palavras-chave.
4. Cada página de serviço cita Curitiba e região no H1 ou na primeira frase e cita ao menos duas cidades da região no corpo, de forma natural.

## Placeholders permitidos e o que fazem
| Dado | Placeholder | Comportamento |
|---|---|---|
| WhatsApp | `""` | botões somem |
| Telefone | `""` | oculto |
| Redes | `socialLive=false` | links ocultos |
| Razão social/CNPJ | `""` | omitidos no rodapé e na privacidade (a privacidade usa `{{CONTROLADOR}}`, ver `docs/07`) |
| Obras | nenhuma | seção e rota somem |
| Preço | `null` | bloco não renderiza; texto "faixa em até um dia útil" |
