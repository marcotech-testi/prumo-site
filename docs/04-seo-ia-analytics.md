# 04 — SEO, Google Search, Bing e analytics

Premissa do Marco: o site **nasce com toda a configuração de SEO e de Google Search pronta**. Nada de "SEO depois". O que depende de contas do Marco está em `docs/08`; o código deixa tudo encaixado e testado.

## Metadados por página (`generateMetadata`; canonical absoluto; `lang="pt-BR"`; OG `locale: pt_BR`)
| Rota | `<title>` (≤ 60) | `description` (≤ 155) |
|---|---|---|
| `/` | Jardim vertical em Curitiba \| Prumo Paisagismo | Jardins verticais e paisagismo com irrigação automatizada em Curitiba e região. Projeto, execução e manutenção. Orçamento em até um dia útil. |
| `/jardim-vertical` | Jardim vertical em Curitiba e região \| Prumo | Projeto, execução e manutenção de jardim vertical natural com irrigação automatizada. Envie fotos e medidas e receba uma faixa de investimento. |
| `/irrigacao-automatizada-e-paisagismo` | Irrigação automatizada e paisagismo em Curitiba \| Prumo | Como funciona a irrigação automatizada de um jardim vertical e como a Prumo projeta o sistema junto com o jardim. Curitiba e região. |
| `/manutencao-de-jardim-vertical` | Manutenção de jardim vertical em Curitiba \| Prumo | Plano mensal de manutenção de jardim vertical: poda, adubação, ajuste da irrigação e reposição de plantas, com registro de cada visita. |
| `/para-arquitetos` | Jardim vertical para arquitetos \| Prumo Paisagismo | Você especifica, a Prumo executa e cuida. Apoio técnico em espécies, estrutura e irrigação, e manutenção para o cliente final. |
| `/obras` | Obras de jardim vertical em Curitiba \| Prumo | Obras executadas com bairro, metragem e sistema de irrigação. Jardins verticais em Curitiba e região metropolitana. |
| `/orcamento` | Orçamento de jardim vertical \| Prumo Paisagismo | Envie fotos e medidas da parede e receba uma faixa de investimento em até um dia útil. Curitiba e região metropolitana. |
| `/perguntas-frequentes` | Perguntas sobre jardim vertical \| Prumo | Custo, manutenção, irrigação, apartamento, garantia e como escolher uma empresa de jardim vertical em Curitiba. |
| `/sobre` | Sobre a Prumo Paisagismo | Quem está por trás da Prumo: projeto, atendimento e execução de jardins verticais em Curitiba e região. |
| `/privacidade` | Política de Privacidade e Cookies \| Prumo | Como a Prumo trata seus dados e cookies. |
Obras individuais: `title = "{titulo} · {bairro}, {cidade} \| Prumo"`. `/privacidade` e `/orcamento` com `robots: index` normal (orçamento pode indexar).

## Arquivos
- `app/robots.ts`: em produção `allow: /` exceto `/api/`; aponta para `sitemap.xml`; **permitir** explicitamente GPTBot, Google-Extended, PerplexityBot, ClaudeBot e anthropic-ai (o objetivo é ser citado por IAs); não criar regra para outros robôs. Fora de produção `disallow: /`.
- `app/sitemap.ts`: todas as rotas públicas (obras só se houver), `lastModified` real (data do último commit que alterou o conteúdo da página, não a data do build), prioridades `/` 1.0, serviços 0.9, demais 0.6; entradas de imagem para as fotos das obras. Sem URLs com parâmetros, sem `/api`, sem `/_styleguide`.
- Versões `.md` e `/mcp` **não** entram no sitemap.
- `/llms.txt` (route handler `text/plain; charset=utf-8`):
```
# Prumo Paisagismo
> Jardins verticais e paisagismo com irrigação automatizada em Curitiba e região metropolitana (PR). Projeto, execução, irrigação automatizada e manutenção, com orçamento online.

## Serviços
- [Jardim vertical](https://www.prumopaisagismo.com.br/jardim-vertical): jardim vertical natural com irrigação automatizada para casas, apartamentos e fachadas.
- [Irrigação automatizada e paisagismo](https://www.prumopaisagismo.com.br/irrigacao-automatizada-e-paisagismo): controlador programável e gotejamento; paisagismo sob consulta.
- [Manutenção de jardim vertical](https://www.prumopaisagismo.com.br/manutencao-de-jardim-vertical): plano mensal com visita técnica e registro.
- [Para arquitetos](https://www.prumopaisagismo.com.br/para-arquitetos): especificação, execução e pós-obra.

## Versões em Markdown e acesso por agentes
- Cada página tem versão Markdown: acrescente `.md` à URL (ex.: https://www.prumopaisagismo.com.br/jardim-vertical.md) ou envie `Accept: text/markdown`.
- Servidor MCP somente leitura: https://www.prumopaisagismo.com.br/mcp (serviços, perguntas frequentes, área de atendimento, como pedir orçamento).
- A página também expõe ferramentas WebMCP no navegador (ver /orcamento).

## Como pedir orçamento
- [Orçamento online](https://www.prumopaisagismo.com.br/orcamento): envie fotos e medidas; retorno com faixa de investimento em até um dia útil.
- [Perguntas frequentes](https://www.prumopaisagismo.com.br/perguntas-frequentes)

## Contato
contato@prumopaisagismo.com.br · Área de atuação: Curitiba, São José dos Pinhais, Pinhais, Colombo, Araucária, Campo Largo e região metropolitana.
```
- Imagem OG 1200×630 e ícones: gerados por `scripts/build-assets.ts` (usar `sharp`): OG = fundo `#1E3227` com `assets/logo/png/prumo-logo-vertical-negativo.png` centralizado (altura 380 px); `app/icon.svg` = `prumo-simbolo-positivo.svg` (para favicon sobre fundo claro, o SVG já funciona; se o navegador usar tema escuro, aceitar); `apple-icon.png` 180×180 = `prumo-avatar-redes.png`. Commitar os arquivos gerados.

## Dados estruturados (JSON-LD em `src/lib/schema.ts`; injetar com `<script type="application/ld+json">`)
- **Global (layout):** `Organization` + `HomeAndConstructionBusiness` (`@id: {url}/#negocio`): `name`, `description` (descritor), `url`, `logo` (URL do SVG horizontal positivo), `email`, `telephone` (**só se houver**), `areaServed` (lista de `City`/`AdministrativeArea`: Curitiba e os municípios do `siteConfig.areaServed`), `knowsAbout` (jardim vertical, irrigação automatizada, manutenção de jardim vertical, paisagismo), `sameAs` (**só se `socialLive`**). **Sem `address`, sem `geo`, sem `priceRange`, sem `aggregateRating`, sem `review`.**
- **Cada serviço:** `Service` (`provider` = `#negocio`, `areaServed`, `serviceType`, `name`, `description` = resposta direta da página) + `BreadcrumbList`.
- **FAQ:** `FAQPage` em `/perguntas-frequentes` e nas páginas que exibem FAQ (mesmo texto visível).
- **Obras:** `CreativeWork`/`ImageObject` por obra.
- Validar com o teste unitário (JSON válido, sem campos proibidos) e manualmente no Rich Results Test (anotar no PR).

## SEO de conteúdo
H1 único; hierarquia correta; links internos conforme `docs/02`; imagens com `width/height`, `alt` descritivo; sem texto escondido; sem páginas duplicadas para variações de termo; URLs fixas (sem acentos). Preview/`*.vercel.app`: `noindex`.

## Analytics e consentimento
- **Sempre ligados (sem cookies):** Vercel Analytics e Speed Insights.
- **Só após "Aceitar":** GA4 (`NEXT_PUBLIC_GA_ID`) e Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`), carregados com `next/script` `afterInteractive` por `components/consent/Analytics.tsx`; sem consentimento nenhum script de terceiros é injetado. "Recusar" = nada além da análise sem cookies. Link "Preferências de cookies" no rodapé reabre o banner. Google Consent Mode v2: iniciar com `denied` e atualizar para `granted` ao aceitar.
- **Eventos** (sem dados pessoais): `click_whatsapp` (parâmetro `pagina`), `start_quote` (primeiro foco no formulário), `submit_quote` (sucesso; parâmetros `perfil`, `tipo_espaco`), `click_email`, `view_obra` (`slug`). No Meta Pixel enviar apenas dois eventos: `Lead` (em `submit_quote`) e `Contact` (em `click_whatsapp`).
- **Atribuição:** `lib/utm.ts` captura `utm_source|medium|campaign|content|term`, `gclid`, `fbclid` e `document.referrer` na primeira visita, guarda em `sessionStorage` (try/catch) por 30 min de sessão e envia como campos ocultos no orçamento. Também registrar `landingPage`. Isso é o que mede o custo por pedido do tráfego de R$ 500–1.000/mês.
- Anúncios: as campanhas apontam para `/jardim-vertical` ou `/orcamento` com UTMs; **não criar landing pages duplicadas indexáveis**.

## Google Search — configuração completa (T8)
**Indexação e snippets**
- `metadata.robots` em produção: `index, follow` + `max-snippet: -1`, `max-image-preview: large`, `max-video-preview: -1` (permite snippets e visões gerais de IA completas). Fora de produção: `noindex, nofollow` (cabeçalho e meta).
- `canonical` absoluto em todas as páginas (sem parâmetros; `?perfil=`, `?obra=` e UTMs canonizam para a rota limpa). `lang="pt-BR"`, `og:locale=pt_BR`. Sem `hreflang` (site monolíngue).
- Redirecionamentos 301/308: `http`→`https`, apex→`www`, barra final removida, caixa alta→baixa. Página inexistente devolve **status 404 real** (nunca "soft 404"); `/obras` sem obras = 404.
- Nenhum interstitial intrusivo: o banner de cookies é pequeno, não cobre conteúdo e não bloqueia a rolagem.
**Verificação de propriedade**
- `metadata.verification.google` ← `NEXT_PUBLIC_GSC_VERIFICATION` e `verification.other["msvalidate.01"]` ← `NEXT_PUBLIC_BING_VERIFICATION` (só emitem a meta se a variável existir). O caminho preferido é a verificação por DNS (propriedade de domínio), que o Marco faz; a meta fica de reserva.
**Bing e outros buscadores**
- **IndexNow:** arquivo de chave em `public/{INDEXNOW_KEY}.txt` gerado no build a partir de `INDEXNOW_KEY`; `scripts/indexnow.ts` envia as URLs alteradas (lê o sitemap) para `https://api.indexnow.org/indexnow`; rodar em GitHub Action após deploy de produção em `main`. (O Google não usa IndexNow; para o Google vale o sitemap + Search Console.)
**Dados estruturados** (além do descrito acima): `WebSite` (`name: "Prumo Paisagismo"`, `alternateName: ["Prumo"]`, `url`) para o nome do site nos resultados; `BreadcrumbList` em todas as páginas internas, **com breadcrumb visível** igual ao JSON-LD; `Organization` com `logo` em PNG/SVG quadrado de pelo menos 112 px (usar o avatar); sem `SearchAction`. `FAQPage` permanece (legibilidade por máquinas e IAs), mas **não** esperar resultado rico de FAQ no Google (restrito pela Google).
**Ícones e manifesto**
- `app/favicon.ico` (48×48), `app/icon.svg`, `app/apple-icon.png` (180), `public/icon-192.png`, `public/icon-512.png`, `app/manifest.ts` (`name`, `short_name: "Prumo"`, `theme_color: #1E3227`, `background_color: #E9E6DF`, `display: browser`). Todos gerados por `scripts/build-assets.ts` e acessíveis ao Googlebot (nunca bloqueados em `robots`).
**Desempenho e experiência de página (Core Web Vitals)**
- Metas em campo e laboratório: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Hero sem imagem pesada; fonte pré-carregada com `size-adjust` de fallback para evitar CLS; imagens com `width/height`; scripts de terceiros só após consentimento e com `afterInteractive`. Vercel Speed Insights mede em campo.
**Linkagem interna e conteúdo**
- Cada página de serviço recebe links de pelo menos 2 outras páginas; âncoras descritivas; nenhuma página órfã; sem conteúdo duplicado entre páginas; `title` e H1 diferentes entre si, e únicos no site.
**Google Business Profile e Search Console (Marco, `docs/08`)** — o site já contém: nome, e-mail, descrição e área de atendimento coerentes com o perfil; `sameAs` ganha o link do perfil/redes quando existirem (`NEXT_PUBLIC_GBP_URL`, `socialLive`). Sem endereço visível (atendimento em área).
**Medição de busca:** GA4 com `submit_quote` marcado como evento-chave (conversão) e vinculação ao Search Console feita pelo Marco; UTMs preservados (ver "Analytics").

## Verificação automática: `pnpm check:seo` (roda no CI, contra `next start`)
Percorre o sitemap e, para cada URL: status 200; um único `<h1>`; `title` 20–60 caracteres e único; `description` 70–155 e única; `canonical` igual à URL; `robots` coerente com o ambiente; `lang="pt-BR"`; `og:title/description/image/url/locale`; todas as `<img>` com `alt` (ou `alt=""` decorativo); JSON-LD parseável, sem `address`, `priceRange`, `aggregateRating`, `review`; breadcrumb visível = JSON-LD; links internos sem 404; `robots.txt` aponta para o sitemap; todas as URLs do sitemap respondem 200 e nenhuma é `noindex`; `/llms.txt`, `/favicon.ico`, `/manifest.webmanifest` existem; cada página tem versão `.md`. Falhou = CI vermelho.
