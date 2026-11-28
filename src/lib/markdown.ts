import { faqByIds } from "@/content/faq";
import lastmod from "@/content/lastmod.generated.json";
import { getObra, getPublishedObras } from "@/content/obras";
import { contentPages, home } from "@/content/pages";
import { orcamento } from "@/content/pages/orcamento";
import { formatM2, obraSpecRows, obrasPage } from "@/content/pages/obras";
import { whyItems } from "@/content/pages/home";
import { privacidade, privacidadeSections } from "@/content/pages/privacidade";
import { priceText, servicos } from "@/content/servicos";
import { siteConfig } from "@/content/site";
import { sistema } from "@/content/sistema";
import { steps, stepsNote } from "@/content/steps";
import type { Block } from "@/content/types";
import { absoluteUrl } from "./seo";

/** Versão Markdown de cada página, gerada da mesma fonte que o HTML (docs/09, camada 1). */
const dates = lastmod as Record<string, string>;

function blockMd(b: Block): string {
  switch (b.type) {
    case "p":
      return b.text;
    case "list":
    case "spec":
      return b.items.map((i) => `- ${i}`).join("\n");
    case "numbered":
      return b.items.map((i, n) => `${n + 1}. ${i}`).join("\n");
    case "features":
      return b.items.map((i) => `- **${i.title}** ${i.text}`).join("\n");
    case "steps":
      return stepsMd();
    case "faq":
      return faqMd(b.ids);
    case "price":
      return siteConfig.priceRange
        ? priceText(
            siteConfig.priceRange.minM2,
            siteConfig.priceRange.maxM2,
            siteConfig.priceRange.note,
          )
        : "";
    case "links":
      return b.items.map((l) => `- [${l.label}](${absoluteUrl(l.href)})`).join("\n");
    case "diagram":
      return `${sistema.title}:\n\n${sistema.parts.map((p) => `${p.n}. ${p.label}`).join("\n")}\n\n${sistema.caption}`;
  }
}

function stepsMd() {
  return `${steps.map((s, i) => `${i + 1}. **${s.title}** — ${s.text}`).join("\n")}\n\n${stepsNote}`;
}

function faqMd(ids: number[]) {
  return faqByIds(ids)
    .map((f) => `### ${f.question}\n\n${f.answer}`)
    .join("\n\n");
}

function footer(path: string) {
  const date = dates[path]?.slice(0, 10);
  return [
    "---",
    `Contato: ${siteConfig.email} · Área de atuação: Curitiba e região metropolitana (${siteConfig.areaServed.join(", ")}).`,
    date ? `Última atualização: ${date}` : null,
    `Para pedir orçamento: ${absoluteUrl("/orcamento")}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function doc(path: string, h1: string, parts: (string | null | undefined)[]) {
  return `# ${h1}\n\nURL canônica: ${absoluteUrl(path)}\n\n${parts.filter((p) => p && p.trim()).join("\n\n")}\n\n${footer(path)}\n`;
}

function homeMd() {
  return doc("/", home.hero.h1, [
    home.hero.subtitle,
    home.hero.microcopy,
    `## ${home.answer.heading}\n\n${home.answer.text}`,
    `## ${home.services.heading}\n\n${servicos.map((s) => `- [${s.title}](${absoluteUrl(s.href)}): ${s.text}`).join("\n")}`,
    `## ${home.why.heading}\n\n${whyItems(getPublishedObras().length > 0)
      .map((i) => `- **${i.title}** ${i.text}`)
      .join("\n")}`,
    `## ${home.steps.heading}\n\n${stepsMd()}`,
    `## ${home.architects.heading}\n\n${home.architects.text} [${home.architects.link.label}](${absoluteUrl(home.architects.link.href)})`,
    `## ${home.faq.heading}\n\n${faqMd([...home.faq.ids])}`,
    `## ${home.cta.heading}\n\n${home.cta.text}`,
  ]);
}

/** Markdown da rota (sem barra final; "/" para a home) ou null se não existir. */
export function markdownFor(path: string): string | null {
  if (path === "/") return homeMd();
  const page = contentPages.find((p) => p.path === path);
  if (page) {
    return doc(page.path, page.h1, [
      page.answer,
      ...page.sections.map((s) => {
        const body = s.blocks.map(blockMd).filter(Boolean).join("\n\n");
        return s.heading ? `## ${s.heading}\n\n${body}` : body;
      }),
      `## ${page.cta.heading}\n\n${page.cta.text}`,
    ]);
  }
  if (path === orcamento.path) {
    return doc(path, orcamento.h1, [
      orcamento.intro,
      `## ${orcamento.aside.heading}\n\n${orcamento.aside.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
      "O envio do pedido é feito pela pessoa no formulário da página, com fotos ou vídeo da parede e o aceite da política de privacidade.",
    ]);
  }
  if (path === privacidade.path) {
    return doc(path, privacidade.h1, [
      `${privacidade.updatedLabel} ${privacidade.updatedAt}`,
      privacidadeSections()
        .map((s, i) => `${i + 1}. **${s.title}** ${s.text}`)
        .join("\n"),
    ]);
  }
  const obras = getPublishedObras();
  if (path === obrasPage.path && obras.length) {
    return doc(path, obrasPage.h1, [
      obrasPage.intro,
      obras
        .map(
          (o) =>
            `- [${o.titulo}](${absoluteUrl(`/obras/${o.slug}`)}): ${o.bairro}, ${o.cidade} · ${formatM2(o.metragemM2)} · ${o.irrigacao}`,
        )
        .join("\n"),
    ]);
  }
  const m = path.match(/^\/obras\/([a-z0-9-]+)$/);
  const obra = m ? getObra(m[1]) : undefined;
  if (obra) {
    return doc(path, obra.titulo, [
      obraSpecRows(obra)
        .map((r) => `- **${r.label}:** ${r.value}`)
        .join("\n"),
      obra.descricao,
      `[${obrasPage.cta.label}](${absoluteUrl(obrasPage.cta.href(obra.slug))})`,
    ]);
  }
  return null;
}

/** Todas as rotas com versão Markdown. */
export function markdownPaths() {
  const obras = getPublishedObras();
  return [
    "/",
    ...contentPages.map((p) => p.path),
    orcamento.path,
    privacidade.path,
    ...(obras.length ? [obrasPage.path, ...obras.map((o) => `/obras/${o.slug}`)] : []),
  ];
}
