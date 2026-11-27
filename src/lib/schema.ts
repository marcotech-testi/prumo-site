import { faqByIds } from "@/content/faq";
import type { Obra } from "@/content/obras-schema";
import { siteConfig } from "@/content/site";
import { publicEnv } from "./env";
import { absoluteUrl } from "./seo";
import type { Crumb } from "./breadcrumbs";

/** JSON-LD (docs/04). Sem address, geo, priceRange, aggregateRating ou review. */
const businessId = () => `${siteConfig.url}/#negocio`;

const areaServed = () =>
  siteConfig.areaServed
    .map((name) => ({ "@type": "City", name }))
    .concat([{ "@type": "AdministrativeArea", name: "Região Metropolitana de Curitiba" }]);

export function sameAs() {
  const list: string[] = [];
  if (siteConfig.socialLive) {
    list.push(
      `https://www.instagram.com/${siteConfig.instagram}`,
      `https://www.tiktok.com/@${siteConfig.instagram}`,
      `https://www.youtube.com/@${siteConfig.instagram}`,
    );
  }
  if (publicEnv.gbpUrl) list.push(publicEnv.gbpUrl);
  return list;
}

export function businessSchema() {
  const same = sameAs();
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "HomeAndConstructionBusiness"],
    "@id": businessId(),
    name: siteConfig.name,
    alternateName: "Prumo",
    description: siteConfig.descriptor,
    url: siteConfig.url,
    logo: absoluteUrl("/brand/prumo-avatar-redes.png"),
    image: absoluteUrl("/opengraph-image.png"),
    email: siteConfig.email,
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    areaServed: areaServed(),
    knowsAbout: [
      "jardim vertical",
      "irrigação automatizada",
      "manutenção de jardim vertical",
      "paisagismo",
    ],
    ...(same.length ? { sameAs: same } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: ["Prumo"],
    url: siteConfig.url,
    inLanguage: "pt-BR",
    publisher: { "@id": businessId() },
  };
}

export function serviceSchema({
  name,
  serviceType,
  description,
  path,
}: {
  name: string;
  serviceType: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: { "@id": businessId() },
    areaServed: areaServed(),
  };
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

export function faqSchema(ids: number[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqByIds(ids).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function obraSchema(o: Obra) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: o.titulo,
    url: absoluteUrl(`/obras/${o.slug}`),
    dateCreated: String(o.ano),
    creator: { "@id": businessId() },
    locationCreated: { "@type": "Place", name: `${o.bairro}, ${o.cidade}` },
    image: o.fotos.map((f) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(f.src),
      caption: f.alt,
    })),
  };
}

/** Campos proibidos em qualquer JSON-LD do site. */
export const FORBIDDEN_SCHEMA_KEYS = ["address", "geo", "priceRange", "aggregateRating", "review"];
