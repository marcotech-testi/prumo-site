import { obraTipoLabel, type Obra } from "../obras-schema";

/** `/obras` e `/obras/[slug]` (docs/07 e docs/04). */
export const obrasPage = {
  path: "/obras",
  label: "Obras",
  title: "Obras de jardim vertical em Curitiba | Prumo",
  description:
    "Obras executadas com bairro, metragem e sistema de irrigação. Jardins verticais em Curitiba e região metropolitana.",
  h1: "Obras",
  intro: "Trabalhos executados, com bairro, metragem e o sistema de irrigação de cada um.",
  cardLink: "Ver obra",
  galleryLabel: "Fotos da obra",
  specCaption: "Ficha técnica",
  cta: { label: "Quero uma parede como esta", href: (slug: string) => `/orcamento?obra=${slug}` },
} as const;

export function obraTitle(o: Obra) {
  return `${o.titulo} · ${o.bairro}, ${o.cidade} | Prumo`;
}

export function obraDescription(o: Obra) {
  return `${o.titulo} de ${formatM2(o.metragemM2)} em ${o.bairro}, ${o.cidade}. ${o.irrigacao}.`.slice(
    0,
    155,
  );
}

export function formatM2(n: number) {
  return `${n.toLocaleString("pt-BR")} m²`;
}

/** Linhas da ficha técnica (docs/02). */
export function obraSpecRows(o: Obra) {
  const rows = [
    { label: "Local", value: `${o.bairro}, ${o.cidade}` },
    { label: "Metragem", value: formatM2(o.metragemM2) },
    { label: "Tipo", value: obraTipoLabel[o.tipo] },
    { label: "Espécies", value: o.especies.join(", ") },
    { label: "Irrigação", value: o.irrigacao },
  ];
  if (o.prazoDias) rows.push({ label: "Prazo", value: `${o.prazoDias} dias` });
  rows.push({ label: "Ano", value: String(o.ano) });
  return rows;
}
