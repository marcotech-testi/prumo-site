import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

export function absoluteUrl(path: string) {
  return path === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${path}`;
}

/** Metadados por página: título absoluto, descrição, canonical e Open Graph. */
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
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.name,
      url,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
