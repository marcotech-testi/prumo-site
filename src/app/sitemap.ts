import type { MetadataRoute } from "next";
import lastmod from "@/content/lastmod.generated.json";
import { getPublishedObras } from "@/content/obras";
import { obrasRoute, staticRoutes } from "@/content/routes";
import { absoluteUrl } from "@/lib/seo";

const dates = lastmod as Record<string, string>;

/** Rotas públicas com lastmod real (último commit do conteúdo). Sem .md, /mcp, /api ou /_styleguide. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: dates[r.path],
    priority: r.priority,
  }));
  const obras = getPublishedObras();
  if (obras.length) {
    const obraDates = obras
      .map((o) => dates[`obra:${o.slug}`])
      .filter(Boolean)
      .sort();
    entries.push({
      url: absoluteUrl(obrasRoute.path),
      lastModified: obraDates.at(-1),
      priority: obrasRoute.priority,
    });
    for (const o of obras) {
      entries.push({
        url: absoluteUrl(`/obras/${o.slug}`),
        lastModified: dates[`obra:${o.slug}`],
        priority: 0.6,
        images: o.fotos.map((f) => absoluteUrl(f.src)),
      });
    }
  }
  return entries;
}
