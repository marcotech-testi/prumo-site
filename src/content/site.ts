export type PriceRange = { minM2: number; maxM2: number; note: string };

export const siteConfig = {
  name: "Prumo Paisagismo",
  descriptor: "Jardins verticais e paisagismo com irrigação automatizada | Curitiba",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.prumopaisagismo.com.br").replace(
    /\/$/,
    "",
  ),
  email: process.env.NEXT_PUBLIC_EMAIL || "contato@prumopaisagismo.com.br",
  /** Só dígitos com DDI, ex. 5541999999999; vazio = esconde botões. */
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, ""),
  /** Vazio = oculto. */
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  instagram: "prumopaisagismo",
  socialLive: process.env.NEXT_PUBLIC_SOCIAL_LIVE === "true",
  /** Razão social + CNPJ; vazio = rodapé só com "Prumo Paisagismo". */
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "",
  /** null = não publicar preço. */
  priceRange: null as null | PriceRange,
  areaServed: [
    "Curitiba",
    "São José dos Pinhais",
    "Pinhais",
    "Colombo",
    "Araucária",
    "Campo Largo",
    "Fazenda Rio Grande",
  ],
  consentVersion: "2026-11-27",
};

export const socialLinks = [
  { label: "Instagram", href: `https://www.instagram.com/${siteConfig.instagram}` },
  { label: "TikTok", href: `https://www.tiktok.com/@${siteConfig.instagram}` },
  { label: "YouTube", href: `https://www.youtube.com/@${siteConfig.instagram}` },
];
