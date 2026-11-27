# 01 — Marca e design (Manual v2: Floresta, Pedra e Água)

Direção **premium e técnica**: parece carimbo de projeto de arquitetura, não floricultura. Muito respiro, tipografia larga, cores sóbrias, nenhuma decoração.

## Ativos (já prontos em `assets/`)
| Arquivo | Uso no site |
|---|---|
| `assets/logo/prumo-logo-horizontal-positivo.svg` (718×204) | Header sobre Pedra/Papel |
| `assets/logo/prumo-logo-horizontal-branco.svg` | Footer e áreas Floresta |
| `assets/logo/prumo-logo-vertical-negativo.svg` (607×380) | Imagem OG (sobre Floresta) |
| `assets/logo/prumo-simbolo-positivo.svg` / `-branco.svg` (120×190) | Favicon, marca d'água decorativa |
| `assets/logo/prumo-avatar-redes.svg` e `png/prumo-avatar-redes.png` | `apple-touch-icon` (180×180), redes |
| `assets/fontes/archivo-vf-latin.woff2` | Fonte do site (variável: `wght` 100–900, `wdth` 62–125, ~89 KB) |
| `assets/fontes/OFL.txt` | Licença da fonte (copiar para `public/fonts/`) |
| `assets/email/assinatura-logo-480px.png` | Servir em `/assinatura/assinatura-logo-480px.png` (a assinatura de e-mail usa essa URL) |

Regras do logo: tamanho mínimo horizontal 160 px, vertical 100 px, símbolo 48 px; área de proteção = altura de uma letra de PRUMO; nunca esticar, girar, recolorir, sombrear; **as nervuras da folha são vazadas, nunca pintar**. Fundo Pedra/Papel → versão positiva; Floresta/foto escura → branca.

## Tokens (Tailwind v4, CSS-first — `src/app/globals.css`)
```css
@import "tailwindcss";

@font-face {
  font-family: "Archivo";
  src: url("/fonts/archivo-vf-latin.woff2") format("woff2");
  font-weight: 100 900;
  font-stretch: 62% 125%;
  font-style: normal;
  font-display: swap;
}

@theme {
  --color-floresta: #1E3227;
  --color-pedra: #E9E6DF;
  --color-papel: #F4F2EE;
  --color-basalto: #191B19;
  --color-agua: #8FA6B2;          /* SÓ sobre floresta ou basalto */
  --color-agua-profunda: #3E5A68; /* texto secundário sobre pedra/papel */
  --font-sans: "Archivo", ui-sans-serif, system-ui, sans-serif;
  --radius-ui: 4px;
}

html { font-family: var(--font-sans); font-stretch: 100%; color: var(--color-basalto); background: var(--color-pedra); }
.t-expanded { font-stretch: 125%; }          /* títulos, rótulos, números */
.t-eyebrow  { font-stretch: 125%; text-transform: uppercase; letter-spacing: .14em; font-weight: 500; font-size: .8125rem; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
```
Cores e usos: Floresta = cor da marca (fundos escuros, títulos, botão primário); Pedra = fundo claro principal; Papel = seções alternadas/cartões; Basalto = texto corrido; Água = detalhes sobre fundo escuro; Água Profunda = texto secundário sobre claro. Proporção por página: Floresta ~55%, Pedra ~25%, Basalto ~12%, Água ~8%.

**Pares de texto aprovados (únicos permitidos):** Pedra/Papel sobre Floresta (10,9:1) · Basalto sobre Pedra/Papel (13,9:1) · Água sobre Floresta (5,4:1) · Água Profunda sobre Pedra (5,9:1; sobre Papel é maior) · Floresta sobre Pedra/Papel (≥ 10:1). **Proibido:** Água sobre fundo claro; cinza genérico para texto; texto Água Profunda sobre Floresta.

## Tipografia
Uma família: **Archivo**. Títulos e rótulos em largura expandida (`.t-expanded`, 125%), peso 500; texto em largura normal (100%), peso 400/500; negrito = 600.
| Uso | Site |
|---|---|
| H1 | `clamp(2.25rem, 5.2vw, 3.5rem)`, expandida 500, entrelinha 1.1 |
| H2 | `clamp(1.5rem, 3vw, 2.25rem)`, expandida 500, entrelinha 1.2 |
| H3 | 1.25rem, expandida 500 |
| Texto | 1.0625rem (17 px), entrelinha 1.65, máx. 68 caracteres por linha |
| Rótulo (eyebrow) | `.t-eyebrow` — nunca abaixo de 13 px |
Números e medidas ("18 m²") em expandida. Sem itálico decorativo, sem caixa alta em parágrafos.

## Layout
- Container `max-w-[1200px]`, padding lateral 20 px (mobile) / 40 px (desktop). Seções com `py-20 md:py-28`. Grade 12 colunas no desktop.
- Alternar fundos: Hero Floresta → seção Pedra → seção Papel → Floresta (CTA final) → Footer Floresta.
- Linhas finas (`1px`, Basalto a 15% sobre claro; Água a 30% sobre escuro) separam blocos, como carimbo de prancha. Raio máximo 4 px. Sem sombras (exceto menu mobile: `0 1px 0` linha). Sem gradiente.
- Movimento: só fade/translate curto (≤ 300 ms), uma vez por seção; respeitar `prefers-reduced-motion`.

## Componentes (em `src/components/`)
1. **Header**: logo horizontal-positivo (largura 168 px), navegação (Jardim vertical · Irrigação e paisagismo · Manutenção · Obras *(só se houver)* · Para arquitetos · Perguntas), botão primário "Pedir orçamento". Fundo Pedra, linha inferior fina. Mobile: botão "Menu" abre painel em tela cheia (foco preso, `Esc` fecha). Sticky com fundo sólido.
2. **Footer** (Floresta): logo branco, descritor "Jardins verticais e paisagismo com irrigação automatizada | Curitiba", links, e-mail, WhatsApp (se existir), redes (se `SOCIAL_LIVE`), "© {ano} Prumo Paisagismo", link Privacidade. Sem CNPJ/razão social até haver `NEXT_PUBLIC_LEGAL_NAME`.
3. **Button**: primário (fundo Floresta, texto Pedra; hover Basalto), secundário (contorno 1.5 px Floresta; sobre escuro: contorno Pedra), altura mín. 48 px, texto em expandida 500 .9375rem, anel de foco 2 px (Água Profunda no claro, Água no escuro) com offset 2 px.
4. **Hero** (Floresta): eyebrow em Água, H1 em Pedra, subtítulo em Pedra 85%, 2 botões, microcopy em Água. Decoração: símbolo branco gigante (altura 140%) a 8–10% de opacidade, ancorado à direita, `aria-hidden`, e uma linha vertical fina (o "fio de prumo") de 1 px em Água a 40% descendo do topo até o símbolo. Sem foto.
5. **SpecSheet** (ficha técnica): tabela de duas colunas, rótulo em `.t-eyebrow` Água Profunda, valor em Basalto, linhas finas. Usada em obras e em "o que está incluído".
6. **ServiceCard**: fundo Papel, número "01" em expandida, título, 2 linhas de texto, link "Ver detalhes".
7. **StepsTimeline**: 6 etapas numeradas em grade (3×2 desktop, lista vertical mobile), número grande em expandida Água Profunda.
8. **Accordion/FAQ**: `<details>`-like acessível (botão com `aria-expanded`), uma pergunta por linha, sem animação de altura.
9. **StickyCTA (mobile)**: barra fixa inferior com "Pedir orçamento" e (se houver número) "WhatsApp"; some na página `/orcamento`.
10. **CookieBanner**: canto inferior, fundo Papel, linha fina; botões "Aceitar" e "Recusar" **idênticos em tamanho e peso**; link para privacidade. Guarda a escolha em `localStorage` (try/catch) e em cookie `prumo_consent` (1 ano).
11. **QuoteForm**: ver `docs/05`.
12. **ObraCard/ObraGallery**: só quando houver obras (ver `docs/02`).

## Fotografia (quando chegarem)
Obra real, luz natural, sem filtro saturado; jardim inteiro com a arquitetura ao redor, depois detalhe da folhagem; sempre uma foto com escala (pessoa ou móvel); **uma foto da irrigação por obra** (reservatório, controlador, gotejadores). Antes/depois quando existir. Formato servido: AVIF/WebP via `next/image`, proporções 4:3 e 3:2, `alt` descritivo ("Jardim vertical de 18 m² em fachada, Batel, Curitiba").

## Voz (resumo; texto final em `docs/07`)
Fala como arquiteto experiente: calma, exata, sem adjetivo sobrando; trata por "você"; mostra o número antes da promessa; "investimento", não "preço", ao falar de valor. Frases curtas, sem exclamação, sem emoji.
