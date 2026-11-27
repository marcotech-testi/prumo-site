import { getPublishedObras } from "@/content/obras";
import { obraTipoLabel } from "@/content/obras-schema";
import type { ObraResumo } from "./definitions";

/** Resumo público das obras para as ferramentas (servidor). */
export function obrasResumo(): ObraResumo[] {
  return getPublishedObras().map((o) => ({
    slug: o.slug,
    titulo: o.titulo,
    bairro: o.bairro,
    cidade: o.cidade,
    tipo: obraTipoLabel[o.tipo],
    metragemM2: o.metragemM2,
    irrigacao: o.irrigacao,
  }));
}
