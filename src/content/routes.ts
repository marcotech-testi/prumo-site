/**
 * Rotas públicas indexáveis (fonte do sitemap, do llms.txt, do Markdown e do check:seo).
 * `sources` = arquivos cujo último commit define o lastmod da página.
 */
export type PublicRoute = {
  path: string;
  priority: number;
  sources: string[];
};

const shared = ["src/content/faq.ts", "src/content/steps.ts", "src/content/pages/cta.ts"];

export const staticRoutes: PublicRoute[] = [
  {
    path: "/",
    priority: 1,
    sources: ["src/content/pages/home.ts", "src/content/servicos.ts", ...shared],
  },
  {
    path: "/jardim-vertical",
    priority: 0.9,
    sources: ["src/content/pages/jardim-vertical.ts", ...shared],
  },
  {
    path: "/irrigacao-automatizada-e-paisagismo",
    priority: 0.9,
    sources: ["src/content/pages/irrigacao.ts", ...shared],
  },
  {
    path: "/manutencao-de-jardim-vertical",
    priority: 0.9,
    sources: ["src/content/pages/manutencao.ts", ...shared],
  },
  { path: "/para-arquitetos", priority: 0.6, sources: ["src/content/pages/para-arquitetos.ts"] },
  { path: "/orcamento", priority: 0.6, sources: ["src/content/pages/orcamento.ts"] },
  {
    path: "/perguntas-frequentes",
    priority: 0.6,
    sources: ["src/content/pages/perguntas-frequentes.ts", "src/content/faq.ts"],
  },
  { path: "/sobre", priority: 0.6, sources: ["src/content/pages/sobre.ts"] },
  { path: "/privacidade", priority: 0.6, sources: ["src/content/pages/privacidade.ts"] },
];

export const obrasRoute: PublicRoute = {
  path: "/obras",
  priority: 0.6,
  sources: ["src/content/obras"],
};
