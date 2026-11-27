import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { isProductionSite, publicEnv } from "./env";

export function absoluteUrl(path: string) {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

/** Indexação só em produção com o domínio final; fora disso, noindex (meta + cabeçalho). */
export const indexable = isProductionSite;

export const robotsMetadata: Metadata["robots"] = indexable
  ? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    }
  : { index: false, follow: false };

export function verificationMetadata(): Metadata["verification"] {
  const v: NonNullable<Metadata["verification"]> = {};
  if (publicEnv.gscVerification) v.google = publicEnv.gscVerification;
  if (publicEnv.bingVerification) v.other = { "msvalidate.01": publicEnv.bingVerification };
  return Object.keys(v).length ? v : undefined;
}

/** Versão Markdown da página (docs/09). */
export function markdownPath(path: string) {
  return path === "/" ? "/index.md" : `${path}.md`;
}

export const ogImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Prumo Paisagismo",
};

/** Metadados por página: título absoluto, descrição, canonical, Open Graph e alternativa Markdown. */
export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, types: { "text/markdown": absoluteUrl(markdownPath(path)) } },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.name,
      url,
      title,
      description,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}
