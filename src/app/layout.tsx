import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Attribution } from "@/components/analytics/Attribution";
import { Analytics as ConsentAnalytics } from "@/components/consent/Analytics";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { siteConfig } from "@/content/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { WebMcp } from "@/components/agents/WebMcp";
import { obrasResumo } from "@/lib/agent-tools/obras-context";
import { publicEnv } from "@/lib/env";
import { businessSchema, websiteSchema } from "@/lib/schema";
import { robotsMetadata, verificationMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.descriptor,
  applicationName: siteConfig.name,
  robots: robotsMetadata,
  verification: verificationMetadata(),
  openGraph: { locale: "pt_BR", siteName: siteConfig.name, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#1E3227",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          href="/fonts/archivo-vf-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {publicEnv.webmcpOtToken ? (
          <meta httpEquiv="origin-trial" content={publicEnv.webmcpOtToken} />
        ) : null}
      </head>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={[businessSchema(), websiteSchema()]} />
        <Header />
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <StickyCTA />
        <CookieBanner />
        <Attribution />
        <WebMcp obras={obrasResumo()} />
        {/* Sem cookies: sempre ligados (docs/04). GA4/Pixel só com consentimento (T10). */}
        <Analytics />
        <ConsentAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
