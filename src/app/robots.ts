import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { indexable } from "@/lib/seo";

/** Produção: tudo liberado exceto /api/; robôs de IA permitidos explicitamente. Fora dela: nada. */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  const aiBots = ["GPTBot", "Google-Extended", "PerplexityBot", "ClaudeBot", "anthropic-ai"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow: "/api/" })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
