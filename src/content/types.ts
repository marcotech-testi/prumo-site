import type { WhatsappMessageKey } from "./whatsapp-messages";

export type Link = { label: string; href: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "numbered"; items: string[] }
  /** Itens no estilo ficha técnica (uma linha por item). */
  | { type: "spec"; items: string[] }
  /** Blocos com título e texto (ex.: Especificação, Execução, Pós-obra). */
  | { type: "features"; items: { title: string; text: string }[] }
  /** Etapas compartilhadas (src/content/steps.ts). */
  | { type: "steps" }
  /** Perguntas do FAQ compartilhado, por id. */
  | { type: "faq"; ids: number[]; moreLink?: Link }
  /** Bloco de preço condicional: só renderiza se siteConfig.priceRange existir. */
  | { type: "price" }
  | { type: "links"; items: Link[] };

/** Seção; sem `heading`, os blocos seguem a resposta direta sem título próprio. */
export type Section = { id: string; heading?: string; blocks: Block[] };

export type Cta = {
  heading: string;
  text: string;
  primary: Link;
  whatsapp?: WhatsappMessageKey;
  links?: Link[];
};

export type PageContent = {
  /** Rota sem barra final ("/" para a home). */
  path: string;
  /** Rótulo curto da página (breadcrumb, Markdown). */
  label: string;
  title: string;
  description: string;
  eyebrow?: string;
  h1: string;
  /** Resposta direta, logo abaixo do H1. */
  answer?: string;
  sections: Section[];
  cta: Cta;
  whatsapp: WhatsappMessageKey;
  /** Tipo de serviço para JSON-LD Service (páginas de serviço). */
  serviceType?: string;
};
