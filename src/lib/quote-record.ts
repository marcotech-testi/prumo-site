import { randomUUID } from "node:crypto";
import { siteConfig } from "@/content/site";
import { areaAprox, type QuoteRequest } from "./quote-schema";

/** Data/hora ISO com fuso America/Sao_Paulo (-03:00). */
export function isoSaoPaulo(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return `${parts.replace(" ", "T")}-03:00`;
}

/** Registro do pedido no formato do contrato do webhook (schemaVersion 1). */
export function buildQuoteRecord(req: QuoteRequest, now = new Date()) {
  const c = req.campos;
  const at = isoSaoPaulo(now);
  const o = req.origem;
  return {
    schemaVersion: 1 as const,
    id: `pq_${randomUUID().replace(/-/g, "")}`,
    receivedAt: at,
    perfil: c.perfil,
    contato: { nome: c.nome, whatsapp: `55${c.whatsapp}`, email: c.email ?? null },
    local: { cidade: c.cidade, bairro: c.bairro },
    espaco: {
      tipo: c.tipo,
      larguraM: c.naoSeiMedidas ? null : (c.larguraM ?? null),
      alturaM: c.naoSeiMedidas ? null : (c.alturaM ?? null),
      areaAproxM2: c.naoSeiMedidas ? null : areaAprox(c.larguraM, c.alturaM),
      naoSeiMedidas: c.naoSeiMedidas,
    },
    condicoes: { sol: c.sol, pontoAgua: c.pontoAgua },
    prazo: c.prazo ?? null,
    mensagem: c.mensagem ?? null,
    arquivos: req.arquivos,
    origem: {
      pagina: o.pagina ?? null,
      referrer: o.referrer ?? null,
      utm_source: o.utm_source ?? null,
      utm_medium: o.utm_medium ?? null,
      utm_campaign: o.utm_campaign ?? null,
      utm_content: o.utm_content ?? null,
      utm_term: o.utm_term ?? null,
      gclid: o.gclid ?? null,
      fbclid: o.fbclid ?? null,
      obra: o.obra ?? null,
    },
    consentimento: { aceito: true as const, politicaVersao: siteConfig.consentVersion, em: at },
  };
}

export type QuoteRecord = ReturnType<typeof buildQuoteRecord>;
