import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://connect.facebook.net https://va.vercel-scripts.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.facebook.com https://*.public.blob.vercel-storage.com https://vitals.vercel-insights.com",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://www.facebook.com",
  "frame-src https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const isProductionDomain =
  process.env.VERCEL_ENV === "production" &&
  (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://www.prumopaisagismo.com.br");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Versões Markdown (docs/09): /index.md, /{rota}.md e Accept: text/markdown.
        { source: "/index.md", destination: "/md" },
        { source: "/:path((?!md/|api/|_next/).+)\\.md", destination: "/md/:path" },
        {
          source: "/",
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/md",
        },
        {
          source: "/:path((?!md/|api/|_next/|mcp)[^.]+)",
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/md/:path",
        },
      ],
      afterFiles: [{ source: "/mcp", destination: "/api/mcp" }],
      fallback: [],
    };
  },
  async headers() {
    const headers = [
      { source: "/:path*", headers: securityHeaders },
      // Páginas HTML anunciam a versão Markdown e variam por Accept.
      {
        source: "/",
        headers: [
          { key: "Vary", value: "Accept" },
          { key: "Link", value: '</index.md>; rel="alternate"; type="text/markdown"' },
        ],
      },
      {
        source: "/:path((?!api/|_next/|md/|brand/|fonts/|obras/_|assinatura/)[^.]+)",
        headers: [
          { key: "Vary", value: "Accept" },
          { key: "Link", value: '</:path.md>; rel="alternate"; type="text/markdown"' },
        ],
      },
    ];
    if (!isProductionDomain) {
      headers.push({
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      });
    }
    headers.push({ source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] });
    return headers;
  },
};

export default nextConfig;
